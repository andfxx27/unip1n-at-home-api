const mapGameList = (games) => {
  const mappedGameList = [];
  games.forEach((game) => {
    mappedGameList.push(mapGame(game));
  });

  return mappedGameList;
};

const mapGame = (game) => {
  return {
    id: game.id,
    title: game.title,
    avatarUrl: game.avatar_url,
    description: game.description,
    officialWebsite: game.official_website,
    publisher: game.publisher,
    createdDate: game.created_date,
    updatedDate: game.updated_date,
    deletedDate: game.deleted_date,
  };
};

const mapGameVoucherList = (gameVouchers) => {
  const mappedGameVoucherList = [];
  gameVouchers.forEach((gameVoucher) => {
    mappedGameVoucherList.push(mapGameVoucher(gameVoucher));
  });

  return mappedGameVoucherList;
};

const mapGameVoucher = (gameVoucher) => {
  const mappedGameVoucher = {};
  return {
    id: gameVoucher.id,
    gameId: gameVoucher.game_id,
    title: gameVoucher.title,
    description: gameVoucher.description,
    createdDate: gameVoucher.created_date,
    updatedDate: gameVoucher.updated_date,
    deletedDate: gameVoucher.deleted_date,
  };
};

module.exports = {
  mapGameList,
  mapGame,
  mapGameVoucherList,
  mapGameVoucher,
};
