var MovieBox = React.createClass({
  getInitialState: function() {
    return {
      data: []
    };
  },
  loadMoviesFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadMoviesFromServer();
    setInterval(this.loadMoviesFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="movieBox">
        <MovieList data={this.state.data} />
      </div>
    );
  }
});

var MovieList = React.createClass({
  render: function() {
    var movieNodes = this.props.data.map(function (movie) {
      return (
        <Movie {...movie}/>
      );
    });
    return (
      <div className="movie-list">
        {movieNodes}
      </div>
    );
  }
});

var Movie = React.createClass({
  getInitialState: function() {
    return {hover: false, side: "left"};
  },
  getPosition: function(element) {
    var xPosition = 0;
    var yPosition = 0;
    var parentWidth = 0;
    while (element) {
        xPosition = (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition = (element.offsetTop - element.scrollTop + element.clientTop);
        parentWidth = (element.offsetWidth);
        element = element.offsetParent;
    }
    return { parentWidth: parentWidth, x: xPosition, y: yPosition };
  },
  calculateClick: function(parent, x) {
    var tent = "left";
    if (x > parent.parentWidth/2) {
      tent = "left"
    } else {
      tent = "right"
    }
    this.setState({side: tent});
  },
  handleHover: function(event) {
    var parentPosition = this.getPosition(event.currentTarget);
    var xPosition = event.clientX - parentPosition.x;
    var yPosition = event.clientY - parentPosition.y;
    this.calculateClick(parentPosition, xPosition)
    this.setState({hover: !this.state.hover});
  },
  render: function() {
    var visibility = (this.state.hover) ? "" : "none";
    return (
      <div className ="adj">
        <div className = "movie-box" ref="mycomponent" onMouseOver={this.handleHover} onMouseOut={this.handleHover} >
          <div className = "blackout" style={{display: visibility}}>
            <div className = "replay">
              <a href=""><img src="/assets/replay.png" className="replay-img" /></a>
            </div>
            <div className = "play">
              <a href=""><img src="/assets/play.png" className="play-img" /></a>
            </div>
            <div className = "social">
              <a href=""><img src="/assets/dabomb.png" className="shared-img" /></a>
              <a href=""><img src="/assets/marley&me.png" className="shared-img" /></a>
            </div>
          </div>
          <div className = "movie-img">
            <img src={this.props.img} />
          </div>
          <div className = "movie-info">
            <div className = "info-title">
              {this.props.title}
            </div>
            <div className = "info-sub">
              <span className="genre">
                {this.props.genre.join(", ")}
              </span>
              <span className="time">
                {this.props.time.concat(" min")}
              </span>
            </div>
          </div>
        </div>
        <MovieNode
          visible={this.state.hover}
          side={this.state.side}
          {...this.props} />
      </div>
    );
  }
});

var MovieNode = React.createClass({
  calculateStars: function() {
    var starCount = [];
    for (var i = 0; i < this.props.rating; i++) {
      starCount.push(<img src="/assets/star_active.png" className="star" />);
    }
    for (var i = this.props.rating; i < 5; i++) {
      starCount.push(<img src="/assets/star_inactive.png" className="star" />);
    }
    return starCount;
  },
  findPeople: function() {
    var people = this.props.recommenders.map(function(rec) {
      var image = rec.toLowerCase().concat('.png')
      image = "/assets/cows/".concat(image);
      return (
        <img src={image} className="rec-img" />
      );
    });
    return people
  },
  render: function() {
    var people = this.findPeople();
    var ratingStar = this.calculateStars();
    var visibility = (this.props.visible) ? "" : "none";
    var leftStyle = {
      display: visibility,
      left: 145
    };
    var rightStyle = {
      display: visibility,
      right: 145
    };
    var side = (this.props.side == "left") ? rightStyle : leftStyle;
    var actorLength = this.props.stars.length - 1;
    var actorLinks = this.props.stars.map(function(star, index) {
      if (index == actorLength) {
        return(
          <a href="">{star} </a>
        );
      } else {
        return(
          <span className="enclosure">
            <a href="">{star}</a>
            <span>, </span>
          </span>
        );
      }
    });
    return (
      <div className="movie-node" style={side}>
        <ul className="movie-details">
          <li>
            <div className="title">
              {this.props.title}
            </div>
            <div className="runtime">
              {this.props.time.concat(" min")}
            </div>
          </li>
          <li>
            <div className="genre">
              {this.props.genre.join(', ')}
            </div>
          </li>
          <li>
            <div className="synopsis">
              {this.props.summary}
            </div>
          </li>
          <li>
            <div className="cast">
              <div className="director">
                <span className="movie-sub">
                  Director:
                </span>
                <a href="">{this.props.director}</a>
              </div>
              <div className="actors">
                <span className="movie-sub">
                  Stars:
                </span>
                {actorLinks}
              </div>
            </div>
          </li>
          <li>
            <div className="movie-line">
            </div>
          </li>
          <li>
            <div className="ratings">
              {ratingStar}
            </div>
            <div className="reviews">
              <div className="review-label">{this.props.reviewCount}</div>
              <img src="/assets/reviews.png" className="review-img" />
            </div>
          </li>
          <li>
            <div className="movie-line">
            </div>
          </li>
          <li>
            <div className="recommendations">
              <div className="rec-title">
                Recommended by:
              </div>
              <div className="rec-people">
                {people}
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  }
});
React.render(
  <MovieBox url="api/movies" pollInterval={2000} />,
  document.getElementById('content')
);
