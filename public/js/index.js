var Group = React.createClass({
    handleClick: function() {
        this.props.updateGroup(this.props.group.group_id);  
    },

    render: function() {
       return (
           <div className="group" onClick={this.handleClick} >
                <div className="groupAvatar">
                    <img className="avatar" src={this.props.group.image_url} />
                </div>
                <div className="groupName">
                    {this.props.group.name}
                </div>
           </div>
       );
    }

});

var GroupList = React.createClass({
    render: function() {
        if (this.props.groups == ['Loading Groups']) {
            return(
                <div className='groupList'>
                    {this.props.groups[0]}
                </div>
            );
        }
        else {

            var updateGroup = this.props.updateGroup;
            var groupNodes = this.props.groups.map(function(group) {
                return (
                    <Group updateGroup={updateGroup} group={group} />
                );
            });
            
            return (
                <div className='groupList'>
                    {groupNodes}
                </div>
            );
        }
    }

});

var Filter = React.createClass({
    render: function() {
        return (
          <div className='filterList'>
          filter
          </div>
        );
    }
});

var MessageList = React.createClass({
    getInitialState: function() {
        return {
            messages: [],
            group: ""
        };
    },

    getMessages: function() {
        this.serverRequest= $.getJSON('/api/messages', {group: this.state.group},
            function (data) {
                console.log(data);
                this.setState({messages: data.response});
            }.bind(this));
    },

    componentWillReceiveProps: function(nextProps) {

        if (this.state.group != nextProps.group) {
            this.setState({group:nextProps.group});
            this.getMessages();
        }
    },

    componentDidMount: function() {
    },

    render: function() {
        var messages = this.state.messages;

        return (
            <div className='messageList' >
                {this.props.startTime}
                {this.props.endTime}
                {this.props.user_ids}
            </div>
        );
    }
});

var MessageContainer = React.createClass({
    getInitialState: function() {
        return {
            startTime: 0,
            endTime: 2147483647,
            user_ids: []
        };
    },

    handleFilter: function(users, startTime, endTime) {
        this.setState({
            user_ids: users,
            startTime: startTime,
            endTime: endtime
        });
    },

    componentDidMount: function() {
    },

    render: function() {
        var group = this.props.group;

        var members = group.members || [];

        return (
            <div className='rightPanel' >
                <Filter members={members} handleFilter={this.handleFilter} />
                <MessageList group={group} startTime={this.state.startTime} endTime={this.state.endTime} user_ids={this.state.user_ids} />
            </div>
        );
    }

});

var MainBox = React.createClass({
    getInitialState: function() {
        return {
            groups: [],
            currGroup: ''
        };
    },

    handleGroupUpdate: function(groupid) {
        this.setState({
            currGroup: groupid
        });
    },

    componentDidMount: function() {
        this.serverRequest= $.getJSON('/api/groups', {token: document.getElementById('token').getAttribute("data-token")},
            function (data) {
                console.log("Groups Retrieved");        
                this.setState({groups: data.response});
            }.bind(this));
    },

    render: function() {
       var groupList = this.state.groups;
       if (groupList == []) {
           groupList = ["Loading Groups"];
       }

       //var selectedGroup = $.grep(groupList, function(e) { return e.group_id == this.state.currGroup}.bind(this))[0] || {name:'Please Select a group'};
       var selectedGroup = this.state.currGroup;
       console.log(selectedGroup);

       return (
            <div className="mainWrapper">
                <GroupList updateGroup={this.handleGroupUpdate} groups={groupList} />
                <MessageContainer group={selectedGroup}  />
            </div>
       );
    }
});

ReactDOM.render(
    <MainBox />,
    document.getElementById('content')
);
