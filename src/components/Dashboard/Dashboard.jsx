const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <h1 className="text-2xl text-red-600 font-bold mb-6">
          Welcome to Analytics Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Bar chart Diagram</h2>
            <img
              src="https://cdn3.iconfinder.com/data/icons/market-and-economic/48/93-1024.png"
              className=" object-cover "
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Pie Chart</h2>
            <img
              src="https://d138zd1ktt9iqe.cloudfront.net/media/seo_landing_files/geetha-e-pie-charts-02-1603374708.png"
              className=" object-cover "
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Six Phases</h2>
            <img
              src="https://miro.medium.com/max/1080/0*3G3gcpq-6HA1F27F.png"
              className=" object-cover "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
