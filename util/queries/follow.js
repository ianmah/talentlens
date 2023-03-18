const IS_FOLLOWING = `query($request: IsFollowingRequest!) {
    profile(request: $request) {
      isFollowedByMe
    }
  }`

export default IS_FOLLOWING