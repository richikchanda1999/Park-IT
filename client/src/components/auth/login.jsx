import React from 'react';
import {makeStyles, useTheme, createMuiTheme} from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {red} from "@material-ui/core/colors";
import {ThemeProvider} from "@material-ui/styles";
import Grid from '@material-ui/core/Grid';
import {Divider} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '60%',
        maxWeight: '60%',
        backgroundColor: 'rgb(221, 210, 178)',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

const theme = createMuiTheme({
    typography: {
        h1: {
            fontFamily: "Londrina Solid', cursive",
            fontSize: 17,
        },
        body2: {
            fontFamily: "'Nunito', sans-serif",
            fontSize: 12,
        }
    },
});

export default function RecipeReviewCard() {
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <Card className={classes.root}>
                <CardContent>
                    <Grid container direction="row" justify="space-evenly" alignItems="center">
                        <Grid item xs={8}>
                            <Typography variant="h1">
                                Welcome to PARK-IT
                            </Typography>
                        </Grid>
                        <Divider orientation="vertical" flexItem />
                        <Typography variant="body2">
                            Sign in
                        </Typography>
                    </Grid>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
}