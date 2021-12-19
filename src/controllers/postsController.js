const router = require('express').Router();

const { readToken, isAuthenticated, isAuthor } = require('../middlewares/authMiddleware');
const postService = require('../services/postService');
const userService = require('../services/userService');

router.get('/', readToken, async (req, res) => {
    try {
        let posts = await postService.getAll();
        let result = posts.map(post => {
            let r = { ...post, userLikesImage: post.votes.some(x => x.toString() == req.user?._id) };
            return r;
        });

        res.send(JSON.stringify(result));
    } catch (error) {
        console.log({ success: false, error });
        res.send({ success: false, error: error.message });
    }
});

router.post('/create', isAuthenticated, async (req, res) => {
    try {
        await postService.create(req.body);
        res.send({ success: true });
    } catch (error) {
        console.log({ success: false, error });
        res.send({ success: false, error: error.message });
    }
});

router.get('/:postId', readToken, async (req, res) => {
    try {
        let post = await postService.getOne(req.params.postId);
        
        let isAuthor = post.author._id.toString() === req.user?._id; // post.author._id is a Mongo ObjectID, so need to convert to string.
        let userLikesImage = post.votes.some(x => x.toString() === req.user?._id);

        let result = { ...post, isAuthor, userLikesImage };
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log({ success: false, error });
        res.send({ success: false, error: error.message });
    }
});

router.get('/:postId/vote', isAuthenticated, async (req, res) => {
    try {
        let post = await postService.getOne(req.params.postId);

        if (post.votes.some(x => x.toString() === req.user._id)) {
            //unliking
            await postService.downvote(req.params.postId, req.user._id, -1);
        } else {
            //liking
            await postService.vote(req.params.postId, req.user._id, 1);
        }

        let updatedPost = await postService.getOne(req.params.postId);
        res.send({ success: true, likesCount: updatedPost.votes.length });
    } catch (error) {
        console.log({ success: false, error });
        res.send({ success: false, error: error.message });
    }
});

router.post('/:postId/edit', isAuthenticated, isAuthor, async (req, res) => {
    try {
        let result = await postService.updateOne(req.params.postId, req.body);
        res.send({ success: true, result });
    } catch (error) {
        console.log({ success: false, error });
        res.send({ success: false, error: error.message });
    }
});

router.delete('/:postId', isAuthenticated, isAuthor, async (req, res) => {
    try {
        await postService.deleteOne(req.params.postId);
        res.send({ success: true });
    } catch (error) {
        console.log({ success: false, error });
        res.send({ success: false, error: error.message });
    }
});

// router.get('/mine', isAuthenticated, async (req, res) => {
//     try {
//         let posts = await postService.getForUser(req.user._id);
//         posts.map(x =>
//         ({
//             ...x,
//             user: userService.getOne(x.author)
//         }));

//         res.render('posts/mine', { posts });
//     } catch (error) {
//         res.render('posts', { error })
//     }
// })

exports.router = router;
