import React from 'react';
import '../../styles/HeaderLabel.css';

export default ({ children = 'label', direction = 'default', priority = null, sortable = false }) => {
  if (sortable) {
    return (
      <div className="HeaderLabel">
        {children} {typeof priority === 'number' ? <span className="priority">{priority + 1}</span> : null} {<span className={`sortable ${direction ? direction : 'default'}`} />} 
      </div>)
  }
  else
    return (<div className="HeaderLabel">{children}</div>)
};
