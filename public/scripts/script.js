/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
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
              <a href=""><img src="/assets/shared1.png" className="shared-img" /></a>
              <a href=""><img src="/assets/green.png" className="shared-img" /></a>
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
  render: function() {
    var visibility = (this.props.visible) ? "" : "none";
    var leftStyle = {
      display: visibility,
      left: 200
    };
    var rightStyle = {
      display: visibility,
      right: 200
    };
    var side = (this.props.side == "left") ? rightStyle : leftStyle;
    console.log(side);
    return (
      <div className="movie-node" style={side}>
        <div className="movie-header">
          <div className="title">
            {this.props.title}
          </div>
          <div className="runtime">
            {this.props.time}
          </div>
        </div>
        <div className="genre">
          {this.props.genre}
        </div>
        <div className="synopsis">
          {this.props.summary}
        </div>
        <div className="cast">
          <div className="director">
            {this.props.director}
          </div>
          <div className="actors">
            {this.props.stars}
          </div>
        </div>
        <div className="reviews">
          <div className="rating">
            {this.props.rating}
          </div>
          <div className="review-count">
            {this.props.reviewCount}
          </div>
        </div>
        <div className="recommendation">
          {this.props.recommenders}
        </div>
      </div>
    );
  }
});
React.render(
  <MovieBox url="api/movies" pollInterval={2000} />,
  document.getElementById('content')
);
