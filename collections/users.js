Users = Meteor.users;

// Search subscribe mongodb fields ['username', 'profile.fullname']
Users.initEasySearch(['username', 'profile.fullname'], {
    use: 'mongo-db'
});


// HELPERS
Users.helpers({
    boards: function() {
        return Boards.find({ userId: this._id });
    },
    hasStarred: function(boardId) {
        return this.profile.starredBoards && _.contains(this.profile.starredBoards, boardId);
    }
});


// BEFORE HOOK
Users.before.insert(function (userId, doc) {

    // connect profile.status default
    doc.profile.status = 'offline';

    // XXX The meteor convention for this field is `name` not `fullname`, see for instance the
    // documentation: http://docs.meteor.com/#/full/meteor_users
    // Third parties packages like `kenton:accounts-sandstorm` or `aldeed:simple-schema` assume
    // that this convention is respected. So maybe we should rename this field?
    if (! doc.profile.fullname && doc.profile.name) {
        doc.profile.fullname = doc.profile.name.replace("%20", " ");
    }

    // slugify to username
    doc.username = slugify(doc.profile.fullname, '');
});


// AFTER HOOK
Users.after.insert(function(userId, doc) {
    var ExampleBoard = {
        title: 'Welcome Board',
        userId: doc._id,
        permission: 'Private' // Private || Public
    };

    // Welcome Board insert and list, card :)
    Boards.insert(ExampleBoard, function(err, boardId) {

        // lists
        _.forEach(['Basics', 'Advanced'], function(title) {
            var list = {
                title: title,
                boardId: boardId,
                userId: ExampleBoard.userId
            };

            // insert List
            Lists.insert(list);
        });
    });
});
