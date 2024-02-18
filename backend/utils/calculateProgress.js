function calculateProgress(videoProgress, scrollHeight) {
  const scrollWeight = 0.5;
  const videoWeight = 0.5;
  const numVideos = Object.keys(videoProgress).length;

  let totalVideoProgress = 0;
  for (let progress of Object.values(videoProgress)) {
    totalVideoProgress += progress;
  }

  // Calculate average progress
  const overallVideoProgress =
    numVideos > 0 ? totalVideoProgress / numVideos : 0;

  const overallProgress =
    scrollHeight * scrollWeight + overallVideoProgress * videoWeight;
  return overallProgress;
}

module.exports = { calculateProgress };
