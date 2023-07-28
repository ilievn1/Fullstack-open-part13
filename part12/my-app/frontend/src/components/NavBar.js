import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useUserValue } from "../UserContext";
import React, { useState } from "react";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ handleLogout }) => {
  const user = useUserValue();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isLoggedIn = !!user;

  return (
    <AppBar position="sticky">
      <Toolbar>
        <div>
          <Button
            aria-controls="menu"
            aria-haspopup="true"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </Button>
          <Menu
            id="menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to="/users"
              >
                <PeopleIcon />
                Users
              </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
                <LibraryBooksIcon />
                Blogs
              </Link>
            </MenuItem>
          </Menu>
        </div>
        <Typography style={{ flexGrow: 1 }} variant="subtitle1">
          {isLoggedIn && `${user.name} logged in`}
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Log out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
