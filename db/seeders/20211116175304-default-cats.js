'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('Cats', [
     {name: 'Felix', breed: "Maine Coon", size: "massive", friendly: true, coat: "thick brown", userId: 1, imgUrl: "https://d.newsweek.com/en/full/611195/omar-maine-coon.jpg?w=1600&h=1200&q=88&f=a2ef8789ff87decbd51167e87167cd51", updatedAt: new Date(), createdAt: new Date()},
     {name: 'Catty', breed: "Siberian Cat", size: "medium", friendly: false, coat: "thick grey/black", userId: 1, imgUrl: "https://d17fnq9dkz9hgj.cloudfront.net/breed-uploads/2018/08/siberian-card-small.jpg?bust=1535569540", updatedAt: new Date(), createdAt: new Date()},
     {name: 'Whitey', breed: "Persian Cat", size: "small", friendly: true, coat: "thick white", userId: 1, imgUrl: "https://d3544la1u8djza.cloudfront.net/APHI/Blog/2016/10_October/persians/Persian+Cat+Facts+History+Personality+and+Care+_+ASPCA+Pet+Health+Insurance+_+white+Persian+cat+resting+on+a+brown+sofa-min.jpg", updatedAt: new Date(), createdAt: new Date()},
     {name: 'Luka', breed: "Tabby", size: "small", friendly: false, coat: "orange", userId: 2, imgUrl: "https://c.tenor.com/uCYyz6qbtMQAAAAM/ot-movie-cat.gif", updatedAt: new Date(), createdAt: new Date()},
     {name: 'Garfield', breed: "Fictional Cat", size: "large", friendly: false, coat: "orange and black", userId: 2, imgUrl: "https://st1.latestly.com/wp-content/uploads/2021/06/Garfield.jpg", updatedAt: new Date(), createdAt: new Date()},
     {name: 'Itty Bitty Kitty', breed: "Barn Cat", size: "small", friendly: true, coat: "orange and white", userId: 3, imgUrl: "https://i.pinimg.com/736x/33/32/6d/33326dcddbf15c56d631e374b62338dc.jpg", updatedAt: new Date(), createdAt: new Date()},
     {name: 'Sunshine', breed: "House Cat", size: "medium", friendly: true, coat: "tabby", userId: 1, imgUrl: "https://media.istockphoto.com/photos/cat-with-blue-eyes-looks-at-camera-picture-id1067347086?b=1&k=20&m=1067347086&s=170667a&w=0&h=kLUll2ujZmQo8JjMQYuxyVCtCtdd6W6ylzu6fJqu8PI=", updatedAt: new Date(), createdAt: new Date()},
     {name: 'Sven', breed: "Norwegian Forest Cat", size: "large", friendly: true, coat: "thick white and brown", userId: 1, imgUrl: "https://www.thegoodypet.com/wp-content/uploads/2021/03/Norwegian-Forest-Cat-Your-Complete-Breed-Guide.jpg", updatedAt: new Date(), createdAt: new Date()},
     {name: 'Whitey', breed: "British Shorthair", size: "small", friendly: true, coat: "thick white", userId: 1, imgUrl: "https://cattime.com/assets/uploads/2011/12/file_2744_british-shorthair-460x290-460x290.jpg", updatedAt: new Date(), createdAt: new Date()},
     {name: 'Grey', breed: "Russian Blue", size: "large", friendly: true, coat: "black", userId: 1, imgUrl: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F47%2F2020%2F08%2F02%2Frussian-blue-cat-175701659-2000.jpg", updatedAt: new Date(), createdAt: new Date()},
     {name: 'Cat', breed: "Cat", size: "cat-sized", friendly: true, coat: "cat colors", userId: 3, imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/American_Shorthair.jpg/1200px-American_Shorthair.jpg", updatedAt: new Date(), createdAt: new Date()},
     {name: 'Greymalkin', breed: "Sphynx Cat", size: "medium", friendly: true, coat: "none", userId: 1, imgUrl: "https://i.insider.com/5e6a114b235c1844af18ec92?width=700", updatedAt: new Date(), createdAt: new Date()},
   
    ], {});
    },
    
  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Cats', null, {});
  }
};
