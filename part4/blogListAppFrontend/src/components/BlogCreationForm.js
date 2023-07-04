const BlogCreationForm = ({handleBlogCreate}) => (
    <div>
        <h1>Create new</h1>
        <form onSubmit={handleBlogCreate}>
            <div>
                title:  
                <input/>
            </div>
            <div>
                author:  
                <input/>
            </div>
            <div>
                url:  
                <input/>
            </div>
            <button type="submit">create</button>
        </form>
    </div>
)

export default BlogCreationForm