import React from 'react';
import ReactDOM from 'react-dom';
import cssAnimate, { isCssAnimationSupported } from 'css-animation';
import animUtil from './util';

const transitionMap = {
  enter: 'transitionEnter',
  appear: 'transitionAppear',
  leave: 'transitionLeave',
};

const AnimateChild = React.createClass({
  propTypes: {
    children: React.PropTypes.any,
  },

  componentWillUnmount() {
    this.stop();
  },

  componentWillEnter(done) {
    if (animUtil.isEnterSupported(this.props)) {
      this.transition('enter', done);
    } else {
      setTimeout(done, 0);
    }
  },

  componentWillAppear(done) {
    if (animUtil.isAppearSupported(this.props)) {
      this.transition('appear', done);
    } else {
      setTimeout(done, 0);
    }
  },

  componentWillLeave(done) {
    if (animUtil.isLeaveSupported(this.props)) {
      this.transition('leave', done);
    } else {
      // always sync, do not interupt with react component life cycle
      // update hidden -> animate hidden ->
      // didUpdate -> animate leave -> unmount (if animate is none)
      setTimeout(done, 0);
    }
  },

  transition(animationType, finishCallback) {
    const node = ReactDOM.findDOMNode(this);
    const props = this.props;
    const transitionName = props.transitionName;
    this.stop();
    const end = () => {
      this.stopper = null;
      finishCallback();
    };
    if ((isCssAnimationSupported || !props.animation[animationType]) &&
      transitionName && props[transitionMap[animationType]]) {
      this.stopper = cssAnimate(node, `${transitionName}-${animationType}`, end);
    } else {
      this.stopper = props.animation[animationType](node, end);
    }
  },

  stop() {
    const stopper = this.stopper;
    if (stopper) {
      this.stopper = null;
      stopper.stop();
    }
  },

  render() {
    return this.props.children;
  },
});

export default AnimateChild;
