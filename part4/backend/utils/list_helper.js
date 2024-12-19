const dummy = (blogs) => {
    return 1 
  }

  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
  };

  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
      return null; // Handle empty list
    }
  
    const favorite = blogs.reduce((prev, current) => {
      return current.likes > prev.likes ? current : prev;
    });
  
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes,
    };
  };

  


  const mostBlogs = (blogs) => {
    if (blogs.length === 0 ) {
        return null
    }
    
    const blogCounts = {}

    blogs.forEach((blog) => {
        blogCounts[blog.author] = (blogCounts[blog.author] || 0 ) + 1
    })


    const topAuthor = Object.keys(blogCounts).reduce((maxAuthor, author) => {
        return blogCounts[author] > blogCounts[maxAuthor] ? author : maxAuthor
    }) 
    return  {
        author: topAuthor,
        blogs: blogCounts[topAuthor],
    }
  }

  const mostLikes = (blogs) => {

    if (blogs.length === 0) {
        return null
    }

    const likeCounts = {}

    blogs.forEach((blog) => {
        likeCounts[blog.author] = (likeCounts[blog.author] || 0 ) + blog.likes
    })

    const topAuthor = Object.keys(likeCounts).reduce((maxAuthor, author) => {
        return likeCounts[author] > likeCounts[maxAuthor] ? author : maxAuthor

    })

    return {
        author: topAuthor,
        likes: likeCounts[topAuthor],

    }


  }
  

  
  
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }