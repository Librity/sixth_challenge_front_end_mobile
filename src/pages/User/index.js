import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Loading,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  LoadingPage,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loadingList: true,
    loadingNextPage: false,
    refreshing: false,
    page: 1,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const { page } = this.state;

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({ stars: response.data, loadingList: false });
  }

  loadMore = async () => {
    this.setState({ loadingNextPage: true });

    const { navigation } = this.props;
    const { stars } = this.state;

    let { page } = this.state;

    page += 1;

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      stars: [...stars, ...response.data],
      page,
      loadingNextPage: false,
    });
  };

  refreshList = async () => {
    this.setState({ refreshing: true });

    const { navigation } = this.props;

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=1`);

    this.setState({
      stars: response.data,
      refreshing: false,
      page: 1,
    });
  };

  handleWebView = repo => {
    const { navigation } = this.props;

    navigation.navigate('Repo', { repo });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loadingList, loadingNextPage, refreshing } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loadingList ? (
          <Loading />
        ) : (
          <Stars
            data={stars}
            onEndReachedThreshold={0.1}
            onEndReached={this.loadMore}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleWebView(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
        {loadingNextPage && <LoadingPage />}
      </Container>
    );
  }
}
