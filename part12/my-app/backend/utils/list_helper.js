const _ = require('lodash')

const dummy = (blogs) => {
  blogs  
  return 1
}

const totalLikes = (blogs) => blogs.reduce((acc, blogObj) => acc + blogObj.likes, 0)

const favoriteBlog  = (blogs) => {
  const {title, author, likes} = blogs.reduce((fav, blogObj) => fav = fav.likes > blogObj.likes ? fav : blogObj, 0)
  console.log(title, author, likes)
  return {
    title,
    author,
    likes
  }
}


function mostBlogs(blogs) {
  const authorCount = _.countBy(blogs, 'author')
  const maxAuthor = _.maxBy(_.keys(authorCount), (author) => authorCount[author])

  return {
    author: maxAuthor,
    blogs: authorCount[maxAuthor]
  }
}

function mostLikes(blogs) {
  const authorLikes = _.groupBy(blogs, 'author')

  const authorWithMostLikes = _.maxBy(_.keys(authorLikes), (author) => {
    return _.sumBy(authorLikes[author], 'likes')
  })

  const totalLikes = _.sumBy(authorLikes[authorWithMostLikes], 'likes')

  return {
    author: authorWithMostLikes,
    likes: totalLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}