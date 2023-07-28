import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";

const BlogsList = () => {
  const queryClient = useQueryClient();
  const blogs = queryClient.getQueryData("blogs");
  blogs.sort((a, b) => b.likes - a.likes);
  const blogEntryStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div>
      <h2>blogs</h2>
      <List>
        {blogs.map((blog) => (
          <ListItem key={blog.id} style={blogEntryStyle}>
            <ListItemText>
              <Link to={`blogs/${blog.id}`}>{blog.title}</Link>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default BlogsList;
