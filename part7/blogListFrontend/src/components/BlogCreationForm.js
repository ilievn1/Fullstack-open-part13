import { useRef, useContext } from "react";
import { useQueryClient, useMutation } from "react-query";
import blogService from "../services/blogs.js";
import NotificationContext, {
  notificationChange,
  notificationClear,
} from "../NotificationContext.js";
import { useUserValue } from "../UserContext.js";
import { Button, TextField } from "@mui/material";

const BlogCreationForm = ({ togglable }) => {
  const titleRef = useRef();
  const authorRef = useRef();
  const urlRef = useRef();
  const queryClient = useQueryClient();
  const [notification, dispatchNotification] = useContext(NotificationContext);
  const user = useUserValue();

  const getFields = () => ({
    title: titleRef.current.value,
    author: authorRef.current.value,
    url: urlRef.current.value,
  });

  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: (retBlogObj) => {
      const blogs = queryClient.getQueryData("blogs");

      // add user details in order for del btn and creator info to appear in pushed blog
      const modifiedNewBlog = {
        ...retBlogObj,
        user: {
          username: user.username,
          name: user.name,
          id: retBlogObj.user,
        },
      };
      const sortedBlogs = blogs
        .concat(modifiedNewBlog)
        .sort((a, b) => b.likes - a.likes);

      queryClient.setQueryData("blogs", sortedBlogs);

      togglable.current.toggleVisibility();

      dispatchNotification(
        notificationChange(
          `a new blog ${retBlogObj.title} by ${retBlogObj.author} added`
        )
      );
      setTimeout(() => {
        dispatchNotification(notificationClear());
      }, 3000);
    },
    onError: () => {
      dispatchNotification(notificationChange("missing required fiels"));
      setTimeout(() => {
        dispatchNotification(notificationClear());
      }, 3000);
    },
  });
  const handleCreate = async (event) => {
    event.preventDefault();
    const { title, author, url } = getFields();
    const newBlogObj = {
      title,
      author,
      url,
    };

    await newBlogMutation.mutateAsync(newBlogObj);
    event.target.reset();
  };

  return (
    <div>
      <h1>Create new</h1>
      <form onSubmit={handleCreate} role="form">
        <div>
          title:
          <input type="text" id="titleInputField" name="Title" ref={titleRef} />
        </div>
        <div>
          author:
          <input
            type="text"
            id="authorInputField"
            name="Author"
            ref={authorRef}
          />
        </div>
        <div>
          url:
          <input type="text" id="urlInputField" name="URL" ref={urlRef} />
        </div>
        <Button
          id="create-btn"
          variant="contained"
          color="primary"
          type="submit"
        >
          create
        </Button>
      </form>
    </div>
  );
};

export default BlogCreationForm;
