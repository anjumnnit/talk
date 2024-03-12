import React from 'react';

const NotificationBadge = ({ count }) => {
  const badgeStyle = {
    position: 'absolute',
    top: '0',
    right: '0',
    background: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '5px 10px',
    fontSize: '12px',
  };

  return count > 0 ? <div style={badgeStyle}>{count}</div> : null;
};

export default NotificationBadge;
