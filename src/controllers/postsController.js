const router = require('express').Router();

const { isAuthenticated, isAuthor, isNotAuthor } = require('../middlewares/authMiddleware');
const postService = require('../services/postService');
const userService = require('../services/userService');

router.get('/', async (req, res) => {
    try {
        let posts = await postService.getAll();
        res.render('posts', { posts });
    } catch (error) {
        res.render('posts', { error })
    }
});

router.get('/create', isAuthenticated, (req, res) => {
    res.render('posts/create');
});

router.post('/create', isAuthenticated, async (req, res) => {
    try {
        let postData = { ...req.body, author: req.user._id }; // Quick&dirty way to add author ID to the incoming request data.
        await postService.create(postData);

        res.redirect('/posts');
    } catch (error) {
        res.render('posts/create', { error });
    }
});

router.get('/:postId/details', async (req, res) => {
    try {
        let post = await postService.getOne(req.params.postId);

        console.log(JSON.stringify(post));
        let authorName = '???';
        let isAuthor = post.author.toString() === req.user?._id; // post.author is a Mongo ObjectID, so need to convert to string.
        let users = await userService.getByIds(post.votes);

        let hasVoted = post.votes.some(x => x.toString() === req.user?._id);

        let rating = post.rating;
        let likesString = users.length > 0 ? users.map(x => x.email).join(', ') : "No one has voted yet."

        res.render('posts/details', { ...post, authorName, isAuthor, hasVoted, rating, likesString });
    } catch (error) {
        res.render('posts', { error })
    }
});

router.get('/:postId/vote/:vote', isAuthenticated, isNotAuthor, async (req, res) => {
    try {
        let post = await postService.getOne(req.params.postId);

        if (post.votes.some(x => x.toString() === req.user._id)) {
            throw new Error('You have already voted!')
        }

        if (req.params.vote == 1) {
            await postService.vote(req.params.postId, req.user._id, 1);
        } else if (req.params.vote == -1) {
            await postService.vote(req.params.postId, req.user._id, -1);
        }

        res.redirect(`/posts/${req.params.postId}/details`);
    } catch (error) {
        res.render('posts', { error })
    }
});

router.get('/:postId/edit', isAuthenticated, isAuthor, async (req, res) => {
    try {
        let post = await postService.getOne(req.params.postId);

        res.render('posts/edit', { ...post });
    } catch (error) {
        res.render('posts', { error })
    }
});

router.post('/:postId/edit', isAuthenticated, isAuthor, async (req, res) => {
    try {
        await postService.updateOne(req.params.postId, req.body);

        res.redirect(`/posts/${req.params.postId}/details`);
    } catch (error) {
        res.render('posts', { error })
    }
});

router.get('/:postId/delete', isAuthenticated, isAuthor, async (req, res) => {
    try {
        await postService.deleteOne(req.params.postId);

        res.redirect('/posts');
    } catch (error) {
        res.render('posts', { error })
    }
});

router.get('/mine', isAuthenticated, async (req, res) => {
    try {
        let posts = await postService.getForUser(req.user._id);
        posts.map(x =>
            ({
                ...x,
                user: userService.getOne(x.author)
            }));

        res.render('posts/mine', { posts });
    } catch (error) {
        res.render('posts', { error })
    }
})

exports.router = router;
