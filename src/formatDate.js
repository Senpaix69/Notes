export const formatDate = (dateString = new Date()) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    new Date(dateString).toLocaleDateString("en-US", options) +
    ", " +
    new Date().toLocaleTimeString()
  );
};
