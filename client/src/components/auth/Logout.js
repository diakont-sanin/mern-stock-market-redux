import React, { Fragment } from 'react';
import { NavLink } from 'react-bootstrap';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/authActions';

export const Logout = ({ logout }) => {
  return (
    <Fragment>
      <NavLink onClick={logout} href="/">
        Выход
      </NavLink>
    </Fragment>
  );
};

export default connect(null, { logout })(Logout);