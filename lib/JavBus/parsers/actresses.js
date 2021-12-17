
const innerText = x =>
  x.children[0].data;

const href = x =>
  x.attr("href");

module.exports = $ => {
  const list = [];
  $('#waterfall > .item').each(function (i, item) {
    // console.log(i);
    // console.log(item);

    let actressItem = $('a', item).get();
    let photoFrame = $('.photo-frame img', actressItem).get();
    // let photoInfo = $('.photo-info > span', actressItem).get();

    list.push({
      url: actressItem.map(x => $(x).attr("href"))[0],
      img: photoFrame.map(x => $(x).attr("src"))[0],
      name: photoFrame.map(x => $(x).attr("title"))[0],
    });
  });
  // console.log(list);
  return list;
};