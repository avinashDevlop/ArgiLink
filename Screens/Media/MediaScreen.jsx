import React, { useRef, useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from 'expo-av';
import { 
  Ionicons, 
  MaterialIcons, 
  FontAwesome, 
  Entypo 
} from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

// Dimension constants
const { width, height } = Dimensions.get('window');

// Reels Screen Component
const ReelsScreen = ({ navigation }) => {
  // State and Ref Hooks
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const videoRefs = useRef([]);
  const isFocused = useIsFocused(); // Get focus state of the screen

  // Adjust for bottom navigator and device-specific padding
  const BOTTOM_NAV_HEIGHT = 23; // Typical bottom nav height

  // Mock Reels Data - Replace with actual data source
  const reelsData = [
    {
      id: '1',
      username: 'vaaradhi farms',
      caption: 'Orders the products from our website and get 10% off!',
      likes: 367,
      comments: 42,
      shares: 18,
      profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
      videoUri: require('../../assets/media/7.mp4'),
      isLiked: false,
      isFollowing: false,
    },
    {
      id: '2',
      username: 'outdoor_adventures',
      caption: 'more more tomatoes',
      likes: 892,
      comments: 56,
      shares: 23,
      profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
      videoUri: require('../../assets/media/5.mp4'),
      isLiked: true,
      isFollowing: false,
    },
    {
      id: '3',
      username: 'vaaradhi farms',
      caption: 'Desi variety of rice grown in our farm!',
      likes: 1250,
      comments: 89,
      shares: 45,
      profilePic: 'https://randomuser.me/api/portraits/women/3.jpg',
      videoUri: require('../../assets/media/4.mp4'),
      isLiked: false,
      isFollowing: true,
    },
    {
      id: '4',
      username: 'farmer nethra',
      caption: 'all types of vegetables available',
      likes: 1250,
      comments: 89,
      shares: 45,
      profilePic: 'https://randomuser.me/api/portraits/women/3.jpg',
      videoUri: require('../../assets/media/3.mp4'),
      isLiked: false,
      isFollowing: true,
    },
    {
      id: '5',
      username: 'farmersWorld',
      caption: 'Respect the farmers',
      likes: 1250,
      comments: 89,
      shares: 45,
      profilePic: 'https://randomuser.me/api/portraits/women/3.jpg',
      videoUri: require('../../assets/media/2.mp4'),
      isLiked: false,
      isFollowing: true,
    },
    {
      id: '6',
      username: 'farmer nethra',
      caption: 'tomoato farming',
      likes: 1250,
      comments: 89,
      shares: 45,
      profilePic: 'https://randomuser.me/api/portraits/women/3.jpg',
      videoUri: require('../../assets/media/6.mp4'),
      isLiked: false,
      isFollowing: true,
    },
    {
      id: '7',
      username: 'thefarmer',
      caption: 'every day we need to meet a farmer',
      likes: 1250,
      comments: 89,
      shares: 45,
      profilePic: 'https://randomuser.me/api/portraits/women/3.jpg',
      videoUri: require('../../assets/media/1.mp4'),
      isLiked: false,
      isFollowing: true,
    },
    {
      id: '8',
      username: 'agrilink',
      caption: 'what is real happiness?.....',
      likes: 1250,
      comments: 89,
      shares: 45,
      profilePic: 'https://randomuser.me/api/portraits/women/3.jpg',
      videoUri: require('../../assets/media/8.mp4'),
      isLiked: false,
      isFollowing: true,
    },
  ];

  // Pause all videos when screen is not focused
  useEffect(() => {
    if (!isFocused) {
      videoRefs.current.forEach((ref) => {
        if (ref) {
          ref.pauseAsync();
        }
      });
    }
  }, [isFocused]);

  // Viewability configuration
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 90,
  };

  // Viewability handler for video playback
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const currentIndex = viewableItems[0].index;
      setCurrentVisibleIndex(currentIndex);
      
      videoRefs.current.forEach((ref, index) => {
        if (ref) {
          if (currentIndex === index && isFocused) {
            ref.playAsync();
          } else {
            ref.pauseAsync();
          }
        }
      });
    }
  }, [isFocused]);

  // Handle like toggle
  const handleLikeToggle = (index) => {
    const updatedReels = [...reelsData];
    updatedReels[index].isLiked = !updatedReels[index].isLiked;
    updatedReels[index].likes += updatedReels[index].isLiked ? 1 : -1;
    // In a real app, you'd update this in your state management system
  };

  // Handle follow toggle
  const handleFollowToggle = (index) => {
    const updatedReels = [...reelsData];
    updatedReels[index].isFollowing = !updatedReels[index].isFollowing;
    // In a real app, you'd update this in your state management system
  };

  // Render individual reel item
  const renderItem = ({ item, index }) => {
    return (
      <View style={[
        styles.videoContainer, 
        { height: height - BOTTOM_NAV_HEIGHT }
      ]}>
        {/* Video Component */}
        <Video
          ref={(ref) => (videoRefs.current[index] = ref)}
          source={item.videoUri}
          style={styles.video}
          resizeMode="cover"
          shouldPlay={index === currentVisibleIndex && isFocused}
          isLooping
          useNativeControls={false}
        />
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        />

        {/* Bottom Section */}
        <View style={styles.bottomContainer}>
          {/* User Information */}
          <View style={styles.userInfo}>
            <View style={styles.profileContainer}>
              <Image 
                source={{ uri: item.profilePic }} 
                style={styles.profilePic} 
              />
              <View style={styles.userNameContainer}>
                <Text style={styles.username}>{item.username}</Text>
                <TouchableOpacity 
                  style={styles.followButton}
                  onPress={() => handleFollowToggle(index)}
                >
                  <Text style={styles.followButtonText}>
                    {item.isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.caption} numberOfLines={2}>
              {item.caption}
            </Text>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {/* Like Button */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLikeToggle(index)}
            >
              <Ionicons 
                name={item.isLiked ? "heart" : "heart-outline"} 
                size={32} 
                color={item.isLiked ? "red" : "white"} 
                style={styles.actionIcon} 
              />
              <Text style={styles.actionText}>{item.likes}</Text>
            </TouchableOpacity>
            
            {/* Comment Button */}
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons 
                name="comment" 
                size={32} 
                color="white" 
                style={styles.actionIcon} 
              />
              <Text style={styles.actionText}>{item.comments}</Text>
            </TouchableOpacity>
            
            {/* Share Button */}
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome 
                name="share" 
                size={28} 
                color="white" 
                style={styles.actionIcon} 
              />
              <Text style={styles.actionText}>{item.shares}</Text>
            </TouchableOpacity>
            
            {/* More Options Button */}
            <TouchableOpacity style={styles.actionButton}>
              <Entypo 
                name="dots-three-vertical" 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Main Render
  return (
    <View style={styles.container}>
      <FlatList
        data={reelsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        vertical
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        contentContainerStyle={{ 
          paddingBottom: BOTTOM_NAV_HEIGHT 
        }}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    width: width,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  userInfo: {
    flex: 1,
    marginRight: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  followButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  followButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  caption: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
  },
  actionsContainer: {
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: 20,
    alignItems: 'center',
  },
  actionIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default ReelsScreen;