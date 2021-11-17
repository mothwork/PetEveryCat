'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('Cats', [
     {name: 'Felix', breed: "Maine Coon", size: "large", friendly: true, coat: "thick brown", userId: 1, imgUrl: "https://d.newsweek.com/en/full/611195/omar-maine-coon.jpg?w=1600&h=1200&q=88&f=a2ef8789ff87decbd51167e87167cd51", updatedAt: new Date(), createdAt: new Date()},
     {name: 'Catty', breed: "Siberian Cat", size: "medium", friendly: false, coat: "thick grey/black", userId: 1, imgUrl: "https://d17fnq9dkz9hgj.cloudfront.net/breed-uploads/2018/08/siberian-card-small.jpg?bust=1535569540", updatedAt: new Date(), createdAt: new Date()},
     {name: 'Whitey', breed: "Persian Cat", size: "small", friendly: true, coat: "thick white", userId: 1, imgUrl: "https://d3544la1u8djza.cloudfront.net/APHI/Blog/2016/10_October/persians/Persian+Cat+Facts+History+Personality+and+Care+_+ASPCA+Pet+Health+Insurance+_+white+Persian+cat+resting+on+a+brown+sofa-min.jpg", updatedAt: new Date(), createdAt: new Date()},
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
