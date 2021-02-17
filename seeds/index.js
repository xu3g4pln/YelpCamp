const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "602b854d9c640631085021e0",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: "https://source.unsplash.com/collection/483251",
                    filename: "test",
                },
                {
                    url: "https://source.unsplash.com/collection/483251",
                    filename: "test",
                },
            ],
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed qui, assumenda ea a delectus provident? Culpa quidem aliquid praesentium veniam, pariatur commodi eius possimus quod adipisci, eligendi, voluptates minus tenetur!",
            price: price,
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
