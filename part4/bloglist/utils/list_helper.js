const ld = require('lodash')

const dummy = (blog) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, currentBlog) => accumulator + currentBlog.likes, 0)
}

const mostLikedBlog = (blogs) => {
  const blogWithMostLikes = blogs.reduce((accumulator, currentBlog) => currentBlog.likes > accumulator.likes ? currentBlog : accumulator)
  const { title, author, likes } = blogWithMostLikes
  return { title, author, likes }
}

const mostBlogs = (blogs) => {
  const authorBlogCounts = ld.countBy(blogs, 'author')
  const maxAuthorBlog = ld.maxBy(Object.entries(authorBlogCounts), ([author, count]) => count)
  const [authorWithMostBlogs, blogCount] = maxAuthorBlog
  return { author: authorWithMostBlogs, blogs: blogCount }
}

const mostLikes = (blogs) => {
  const likeCounts = ld.map(ld.groupBy(blogs, 'author'), (items, key) => ({ author: key, likes: ld.sumBy(items, 'likes') }))
  return likeCounts.reduce((accumulator, currentAuthor) => currentAuthor.likes > accumulator.likes ? currentAuthor : accumulator)
}

module.exports = { dummy, totalLikes, mostLikedBlog, mostBlogs, mostLikes }