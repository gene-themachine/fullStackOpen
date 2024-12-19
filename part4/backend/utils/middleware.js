const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
      request.token = authorization.replace('Bearer ', '');
    } else {
      request.token = null;
    }
    next(); // Pass control to the next middleware or route
  };
  
  



const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' })

    } else if (error.name ===  'JsonWebTokenError') {
        return response.status(401).json({ error: 'token invalid' })
    }

    next(error)
}

module.exports = { tokenExtractor , errorHandler};
  


