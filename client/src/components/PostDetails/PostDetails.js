import React, {useCallback, useEffect, useState} from 'react';
import useStyles from './styles';
import {CircularProgress, Divider, IconButton, Paper, Typography} from "@material-ui/core";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {deletePost, getPost, getPosts, getPostsBySearch} from "../../Redux/actions/posts";
import RecommendedPosts from "./RecommendedPosts";
import {ArrowBack, DeleteForever, Edit} from "@material-ui/icons";
import noPostPhoto from '../../images/noPostPhoto.jpg';
import CreateEditPostModal from "../NewStyles/Modals/CreateEditPostModal";


const PostDetails = () => {

    const {post, posts, isLoading} = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const {id} = useParams();
    const classes = useStyles();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));

    const [currId, setCurrId] = useState(0);

    const [open, setOpen] = React.useState(false);

    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => setOpen(false), []);

    const editButtonClick = useCallback(() => {
        setCurrId(id);
        handleOpen();
    }, [handleOpen, id]);

    const deleteButtonClick = useCallback(() => {
        dispatch(deletePost(id));
        navigate('/');
    }, [navigate, dispatch, id]);


    useEffect(() => {
        dispatch(getPost(id));
    }, [dispatch, id]);


    useEffect(() => {
        if (post) {
            dispatch(getPostsBySearch({search: 'ss', tags: post?.tags.join(',')}));
        }
    }, [post, dispatch]);


    const backButtonClick = useCallback(() => navigate('/posts'), [navigate]);

    //TODO change other posts logic

    if (!post) return null;

    if (isLoading) {
        return <Paper elevation={6} className={classes.loadingPaper}>
            <CircularProgress size="7em"/>
        </Paper>;
    }

    const recommendedPosts = posts.filter(({_id}) => _id !== post._id);


    // TODO use em instead of px
    return (

        <Paper style={{padding: '0.5em'}}
               elevation={6}>
            <div className={classes.card}>
                <div className={classes.section}>
                    <div className={classes.actions}>
                        <IconButton onClick={backButtonClick}>
                            <ArrowBack style={{fontSize: 30}}/>
                        </IconButton>
                        {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                            <div>
                                <IconButton
                                    color="primary"
                                    onClick={deleteButtonClick}>
                                    <DeleteForever
                                        style={{fontSize: 30}}
                                        color="secondary"/>
                                </IconButton>
                                <IconButton
                                    color="primary"
                                    onClick={editButtonClick}>
                                    <Edit style={{fontSize: 30, color: 'black'}}/>
                                </IconButton>
                            </div>
                        )}
                    </div>
                    <CreateEditPostModal
                        open={open}
                        onClose={handleClose}
                        currentId={currId}
                        setCurrentId={setCurrId}/>
                    <Typography
                        variant="h3"
                        component="h2">{post.title}</Typography>
                    <Typography
                        gutterBottom
                        variant="h6"
                        color="textSecondary"
                        component="h2">
                        {post.tags.map((tag) => `#${tag} `)}
                    </Typography>
                    <Typography
                        gutterBottom
                        variant="body1"
                        component="p">
                        {post.message}
                    </Typography>
                    <Typography variant="h6">Created by: {post.name}</Typography>
                    <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
                    <Divider style={{margin: '2em 0'}}/>
                    <Typography variant="body1"><strong>Comments</strong></Typography>
                    <Divider style={{margin: '2em 0'}}/>
                </div>
                <div className={classes.imageSection}>
                    <img className={classes.media}
                         src={post.file || `${noPostPhoto}`}
                         alt={post.title}/>
                </div>
            </div>
            {recommendedPosts.length && (<div className={classes.section}>
                <Typography
                    gutterBottom
                    variant="h5"
                >
                    Check other posts:
                </Typography>
                <Divider style={{marginBottom: '1em'}}/>
                <div className={classes.recommendedPosts}>
                    {recommendedPosts.map(({title, name, likes, file, _id, createdAt}) => (<RecommendedPosts
                        title={title}
                        name={name}
                        likes={likes}
                        file={file}
                        _id={_id}
                        key={_id}
                        createdAt={createdAt}
                    />))}
                </div>
            </div>)}
        </Paper>);
};

export default PostDetails;
