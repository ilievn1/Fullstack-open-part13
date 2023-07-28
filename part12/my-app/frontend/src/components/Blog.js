import { useMutation, useQueryClient } from "react-query";
import blogService from "../services/blogs.js";
import { useUserValue } from "../UserContext.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import NotificationContext, {
  notificationChange,
  notificationClear,
} from "../NotificationContext.js";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const Blog = ({ blog }) => {
  const user = useUserValue();
  const [notification, dispatchNotification] = useContext(NotificationContext);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const blogLikeMutation = useMutation(blogService.updateLikes, {
    onSuccess: (likedBlogObj) => {
      const blogs = queryClient.getQueryData("blogs");

      const updSortedBlogs = blogs
        .map((b) =>
          b.id === likedBlogObj.id ? { ...b, likes: likedBlogObj.likes } : b
        )
        .sort((a, b) => b.likes - a.likes);
      queryClient.setQueryData("blogs", updSortedBlogs);
    },
  });
  const blogDeleteMutation = useMutation(blogService.deleteBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries("blogs");
      navigate("/");
    },
  });
  const blogCommentMutation = useMutation(blogService.addComment, {
    onSuccess: (commentObj) => {
      const blogs = queryClient.getQueryData("blogs");
      const currentBlog = blog;
      
      const updatedBlogs = blogs.map((b) =>
        b.id === currentBlog.id
          ? { ...b, comments: [...b.comments, commentObj] }
          : b
      );
      queryClient.setQueryData("blogs", updatedBlogs);

      dispatchNotification(notificationChange("comment added"));
      setTimeout(() => {
        dispatchNotification(notificationClear());
      }, 3000);
    },
  });

  const isUserCreator = blog.user.username === user.username ? true : false;

  const handleDelete = async () => {
    const toBeDeleted = blog;
    if (
      window.confirm(`Remove ${toBeDeleted.title} by ${toBeDeleted.author}?`)
    ) {
      await blogDeleteMutation.mutateAsync(toBeDeleted.id);
    }
  };

  const handleLike = async () => {
    // user and comments fields need to comply to Schema models (Object ID)
    const likedBlog = {
      ...blog,
      user: blog.user.id,
      comments: blog.comments.map((c) => c.id),
      likes: blog.likes + 1,
    };
    await blogLikeMutation.mutateAsync({ likedBlog });
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const comment = { content: event.target[0].value };
    event.target[0].value = "";
    await blogCommentMutation.mutateAsync({ blogID: blog.id, comment });
  };
  const classes = {
    root: {
      maxWidth: 800,
      margin: "0 auto",
      padding: "16px",
    },
    title: {
      marginBottom: "16px",
    },
    link: {
      textDecoration: "none",
      color: "blue",
    },
    likes: {
      marginBottom: "8px",
    },
    commentForm: {
      display: "flex",
      alignItems: "center",
      marginTop: "16px",
    },
    commentInput: {
      marginRight: "8px",
      flexGrow: 1,
    },
    commentButton: {
      marginLeft: "8px",
    },
  };
  return (
    <div className="blogContents">

      <Paper style={classes.root}>
        <Typography variant="h4" style={classes.title}>
          {blog.title} {blog.author}
        </Typography>
        <a
          href={`https://www.${blog.url}`}
          target="_blank"
          rel="noreferrer"
          style={classes.link}
        >
          {blog.url}
        </a>
        <Typography variant="body1" style={classes.likes}>
          {blog.likes} likes
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLike}>
          Like
        </Button>
        <Typography variant="body1">Added by {blog.user.name}</Typography>

        {isUserCreator ? (
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            Delete
          </Button>
        ) : null}

        <Typography variant="body1">Comments</Typography>

        <List>
          {blog.comments.map((c) => (
            <ListItem key={c.id}>
              <ListItemText>{c.content}</ListItemText>
            </ListItem>
          ))}
        </List>

        <form onSubmit={handleCommentSubmit} style={classes.commentForm}>
          <TextField
            name="commentInput"
            label="Add a comment"
            style={classes.commentInput}
            multiline
            rows={2}
            variant="outlined"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={classes.commentButton}
          >
            Add Comment
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default Blog;
