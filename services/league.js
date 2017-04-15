var fetch = require('node-fetch');

var leagueurl = 'http://www.leagueofautomatednations.com/'


class LeagueAPI {
  constructor() {
    this.loadData()
  }

  loadData() {
    console.log('load data')
    if(!!this.loaded) {
      var now = Math.round(new Date().getTime()/1000)
      if(now - this.loaded < 5*60) {
        return
      }
    }

    var that = this
    if(!this.data) {
      fetch(leagueurl + 'alliances.js')
      .then(function(response){
        if(!response.ok) {
          throw new Error(response.status + ': ' + response.statusText)
        }
        that.loaded = Math.round(new Date().getTime()/1000)
        return response.json()
      })

      .then(function(json){
        that.alliances = json
        that.users = {}
        for(var alliance in that.alliances) {
          if(that.alliances[alliance]['logo']) {
            that.alliances[alliance]['logo'] = leagueurl + 'obj/' + that.alliances[alliance]['logo']
          } else {
            that.alliances[alliance]['logo'] = leagueurl + 'static/img/leaguelogo.png'
          }
          for(var user of that.alliances[alliance].members) {
            that.users[user.toLowerCase()] = alliance
          }
        }
      })
      .catch(function(err){
        console.log(err.message)
        console.log(err.stack)
      })
    }
  }

  getUserAlliance(user) {
    this.loadData()
    if(!this.users[user.toLowerCase()]) {
      return false
    }
    return this.users[user.toLowerCase()]
  }

  getLogoUrl(alliance) {
    this.loadData()
    if(!this.alliances[alliance] || !this.alliances[alliance]['logo']) {
      return false
    }

    return this.alliances[alliance]['logo']
  }


}

module.exports = new LeagueAPI()
