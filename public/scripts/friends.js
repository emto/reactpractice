var FriendBox = React.createClass({
  render: function() {
    return (
      <FriendCategory data={this.props.items}/>
    );
  }
});

var FriendCategory = React.createClass({
  render: function() {
    var friendNodes = this.props.data.map(function (node) {
      return (
        <ul key={node} className = "left-part">
          <FriendNode type={node} />
        </ul>
      );
    });
    return (
      <li>
        {friendNodes}
      </li>
    );
  }
});

var FriendNode = React.createClass({
  findList: function(category) {
    if (category == 'Online') {
      return ['Jeremy', 'Ashleigh', 'Ben', 'Counsyl', 'Elizabeth'];
    } else {
      return ['Marley', 'Gabi', 'Kevin'];
    }
  },
  render: function() {
    var subCat = this.findList(this.props.type);
    var status = this.props.type
    var subNode = subCat.map(function(sub) {
      return (
        <FriendSpecific key={sub} status={status} title={sub}/>
      );
    });
    return(
      <ul className="left-part">
        <div className="friendtitle">{this.props.type}</div>
        {subNode}
      </ul>
    );
  }
});

var FriendSpecific = React.createClass({
  getInitialState: function() {
    return {hover: false};
  },
  findImage: function(title) {
    var newTitle = title.toLowerCase().concat('.png');
    var fullTitle = "/assets/cows/".concat(newTitle);
    return fullTitle;
  },
  handleHover: function(event) {
    this.setState({hover: !this.state.hover});
  },
  render: function() {
    var imgName = this.findImage(this.props.title);
    var active = {
      backgroundColor: "#d6d6d6",
      borderRadius: '8px'
    };
    var inactive = {
    };
    var online = {
      backgroundColor: '#8dd397'
    };
    var offline = {
      backgroundColor: '#ccc'
    };
    var bgColor = (this.state.hover) ? active : inactive;
    var circleColor = (this.props.status == 'Online') ? online : offline;
    return (
      <li>
        <div className="friend-modules" onMouseOver={this.handleHover} onMouseOut={this.handleHover} style={bgColor} >
          <div className="module-content">
            <a>
              <img src={imgName} className="friend-img" />
              <span className="friend-label">
                {this.props.title}
              </span>
            </a>
          </div>
          <div className="circle-align">
            <div className="circle" style={circleColor}>
            </div>
          </div>
        </div>
      </li>
    );
  }
});

React.render(
  <FriendBox items={ ['Online', 'Offline'] } />,
  document.getElementById('friends')
);
