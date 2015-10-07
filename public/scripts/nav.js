var NavBox = React.createClass({
  getInitialState: function () {
    return {
      activeTab: 'Discover'
    };
  },
  onUpdate: function(val) {
    console.log("lol");
    this.replaceState({activeTab: val});
    console.log(this.state.activeTab);
  },
  render: function() {
    return (
      <FilterCategory activeTab={this.state.activeTab} onUpdate={this.onUpdate} data={this.props.items}/>
    );
  }
});

var FilterCategory = React.createClass({
  render: function() {
    var x = this.props.onUpdate;
    var activeTab = this.props.activeTab;
    var menuNodes = this.props.data.map(function (node) {
      return (
        <ul className = "left-part">
          <FilterNode activeTab={activeTab} onUpdate={x} type={node} />
        </ul>
      );
    });
    return (
      <li>
        {menuNodes}
      </li>
    );
  }
});

var FilterNode = React.createClass({
  findList: function(category) {
    if (category == 'Main') {
      return ['Playing', 'Discover', 'Activity', 'Top Charts', 'New Releases'];
    } else if (category == 'Your Movie Circles') {
      return ['Da Bomb', 'Da Best'];
    } else {
      return ['Marley & Me', 'Time Travel Movies'];
    }
  },
  render: function() {
    var activeTab= this.props.activeTab;
    var subCat = this.findList(this.props.type);
    var x = this.props.onUpdate;
    var subNode = subCat.map(function(sub) {
      return (
        <FilterSpecific activeTab={activeTab} onUpdate={x} title={sub}/>
      );
    });
    return(
      <ul className="left-part">
        <div className="subtitle">{this.props.type}</div>
        {subNode}
      </ul>
    );
  }
});

var FilterSpecific = React.createClass({
  getInitialState: function() {
    return {highlight: false};
  },
  handleClick: function(tab) {
    console.log(tab);
    this.setState({highlight: true});
    console.log(this.state.highlight);
    this.props.onUpdate(tab);
  },
  findImage: function(title) {
    var newTitle = title.toLowerCase().split(' ').join('').concat('.png');
    var fullTitle = "/assets/".concat(newTitle);
    return fullTitle;
  },
  render: function() {
    var highlightStyle = {
      backgroundColor: '#282929',
      borderRadius: '8px'
    };
    var blacklightStyle = {
      backgroundColor: '#11171d'
    };
    var decision = (this.props.activeTab == this.props.title) ? highlightStyle : blacklightStyle;
    var imgName = this.findImage(this.props.title);
    return (
      <li>
        <div className="filter-modules" style={decision}>
          <div className="module-content">
            <a onClick={this.handleClick.bind(this, this.props.title)}>
              <img src={imgName} className="side-img" />
              <span className="side-label">
                {this.props.title}
              </span>
            </a>
          </div>
        </div>
      </li>
    );
  }
});

React.render(
  <NavBox items={ ['Main', 'Your Movie Circles', 'Collections'] } />,
  document.getElementById('hello')
);
