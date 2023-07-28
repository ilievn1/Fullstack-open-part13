import { List, ListItem, ListItemText } from "@mui/material";

const User = ({ user }) => {
  if (!user) {
    return null;
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <List dense={true}>
        {user.blogs.map((b) => (
          <ListItem key={b.id}>
            <ListItemText> {b.title} </ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default User;
