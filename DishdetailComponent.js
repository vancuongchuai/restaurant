import React, { Component } from 'react';
import {
  View, Text, FlatList, Alert, ScrollView,
  StyleSheet, ImageBackground, Modal, Button, PanResponder
} from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { baseUrl } from '../shared/baseUrl';

// redux
import { connect } from 'react-redux';
import { postFavorite, postComment } from '../redux/ActionCreators';

import * as Animatable from 'react-native-animatable';

class RenderDish extends Component {
  constructor(props) {
    super(props);

    // PanResponder cho gesture quét trái
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderEnd: (e, gestureState) => {
        if (gestureState.dx < -200) {
          Alert.alert(
            'Add Favorite',
            'Are you sure you wish to add ' + props.dish.name + ' to favorite?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'OK', onPress: () => props.favorite ? alert('Already favorite') : props.onPressFavorite() }
            ]
          );
        }
        return true;
      }
    });
  }

  render() {
    const { dish, favorite, onPressFavorite, onPressComment } = this.props;
    if (!dish) return <View />;

    return (
      <Card containerStyle={styles.cardContainer} {...this.panResponder.panHandlers}>
        <ImageBackground
          source={{ uri: baseUrl + dish.image }}
          style={styles.dishImage}
        >
          <View style={styles.imageOverlay}>
            <Text style={styles.cardTitleText}>{dish.name}</Text>
          </View>
        </ImageBackground>

        <Card.Divider />
        <Text style={styles.description}>{dish.description}</Text>

        <View style={styles.iconRow}>
          <Icon
            raised
            reverse
            name={favorite ? 'heart' : 'heart-o'}
            type="font-awesome"
            color="#f50"
            onPress={() =>
              favorite ? Alert.alert('Already favorite') : onPressFavorite()
            }
            containerStyle={{ marginHorizontal: 5 }}
          />
          <Icon
            raised
            reverse
            name="pencil"
            type="font-awesome"
            color="#7cc"
            onPress={onPressComment}
            containerStyle={{ marginHorizontal: 5 }}
          />
        </View>
      </Card>
    );
  }
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      rating: 5,
      author: '',
      comment: ''
    };
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  handleComment = (dishId) => {
    const { rating, author, comment } = this.state;
    this.props.postComment(dishId, rating, author, comment);
    this.setState({
      showModal: false,
      rating: 5,
      author: '',
      comment: ''
    });
  };

  markFavorite = (dishId) => {
    this.props.postFavorite(dishId);
  };

  renderCommentItem = ({ item }) => (
    <View style={styles.commentRow}>
      <Text style={styles.commentText}>{item.comment}</Text>
      <Rating
        imageSize={12}
        readonly
        startingValue={item.rating}
        style={styles.commentRating}
      />
      <Text style={styles.commentMeta}>{`-- ${item.author}, ${item.date}`}</Text>
    </View>
  );

  render() {
    const dishId = parseInt(this.props.route?.params?.dishId);

    const dish =
      this.props.dishes?.dishes?.find((d) => d.id === dishId) || null;

    const comments =
      this.props.comments?.comments?.filter((c) => c.dishId === dishId) || [];

    const favorite = (this.props.favorites || []).some((id) => id === dishId);

    return (
      <ScrollView contentContainerStyle={styles.container}>

        {/* ===== ANIMATION CHO RenderDish ===== */}
        <Animatable.View animation="fadeInDown" duration={2000} delay={500}>
          <RenderDish
            dish={dish}
            favorite={favorite}
            onPressFavorite={() => this.markFavorite(dishId)}
            onPressComment={this.toggleModal}
          />
        </Animatable.View>

        {/* ===== ANIMATION CHO COMMENTS ===== */}
        <Animatable.View animation="fadeInUp" duration={2000} delay={500}>
          <Card containerStyle={styles.cardContainer}>
            <Card.Title>
              <Text>Comments</Text>
            </Card.Title>
            <Card.Divider />
            <FlatList
              data={comments}
              renderItem={this.renderCommentItem}
              keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            />
          </Card>
        </Animatable.View>

        {/* ===== MODAL COMMENT ===== */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={this.toggleModal}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Comment</Text>

            <Rating
              showRating
              startingValue={this.state.rating}
              onFinishRating={(rating) => this.setState({ rating })}
              style={{ paddingVertical: 10 }}
            />

            <Input
              placeholder="Author"
              leftIcon={{ type: 'font-awesome', name: 'user-o' }}
              onChangeText={(author) => this.setState({ author })}
              value={this.state.author}
            />

            <Input
              placeholder="Comment"
              leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
              onChangeText={(comment) => this.setState({ comment })}
              value={this.state.comment}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Submit"
                color="#7cc"
                onPress={() => this.handleComment(dishId)}
              />
              <Button
                title="Cancel"
                color="#999"
                onPress={this.toggleModal}
              />
            </View>
          </View>
        </Modal>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: { paddingBottom: 20 },
  cardContainer: {
    borderRadius: 6,
    padding: 0,
    overflow: 'hidden'
  },
  dishImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  imageOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)'
  },
  cardTitleText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center'
  },
  description: { margin: 10, fontSize: 14 },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10
  },
  commentRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff'
  },
  commentText: { fontSize: 14, marginBottom: 6 },
  commentRating: { alignSelf: 'flex-start', marginVertical: 4 },
  commentMeta: { fontSize: 12, color: '#555' },
  itemSeparator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 12
  },
  modal: {
    justifyContent: 'center',
    margin: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#7cc',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
    padding: 10
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  }
});

const mapStateToProps = (state) => ({
  dishes: state.dishes,
  comments: state.comments,
  favorites: state.favorites
});

const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
