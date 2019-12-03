const { Account } = require('../models');

var response = function(res, err, row = undefined){
  this.res = res;
  this.err = err;
  this.row = row;
}

module.exports = {
  getUserInfo: async function (data){
    return new Promise((resolve, reject) => {
      Account.findOne({
        where: {email: data.email}
      }).then(row => {
        return resolve(new response(true, null, row));
      }).catch(err => {
        return reject(new response(false, err));
      });
    });
  },
  updateUserInfo: async function (data){
    console.log(data);
    let getUserRowResponse = await this.getUserInfo(data);
    return new Promise((resolve, reject) => {
      if(getUserRowResponse.res === true){
        getUserRowResponse.row.update({level: data.newLevel, exp: data.newEXP})
        .then(row => {
          return resolve(new response(true, null, row));
        }).catch(err => {
          return reject(new response(false, err));
        });
      }else{
        return reject(new response(false, "해당하는 유저를 찾을 수 없습니다."));
      }
    });
  }
}