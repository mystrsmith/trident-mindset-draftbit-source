const calculateTacticProgress = item => {
  return (
    ((item?.completed_count || 0) / (item?.total_tactics_count || 1)) * 100
  );
};

export default calculateTacticProgress;
