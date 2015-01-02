// Sandstorm support is a proof of concept only
isSandstorm = Meteor.settings && Meteor.settings.public && Meteor.settings.public.sandstorm;

if (isSandstorm) {
    Meteor.subscribe('boards', function() {
        var board = Boards.findOne()
        Router.go("Board", {
            boardId: board._id,
            slug: board.slug
        });
    })
}

Blaze.registerHelper("isSandstorm", function() {
    return isSandstorm;
});
