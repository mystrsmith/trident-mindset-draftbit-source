const calculateCategoryProgress = item => {
  return (
    ((item?.completed_count || 0) / (item?.total_categories_count || 1)) * 100
  );
};

export default calculateCategoryProgress;
