import express from 'express';
import Course from '../utils/models/course.model.js';
import Category from '../utils/models/category.model.js';
import SubCategory from '../utils/models/sub-category.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
    console.log(req.session.auth);
    console.log(req.session.authUser);

    const courseTable = await Course.find();
    const courseList = JSON.parse(JSON.stringify(courseTable));

    let spotlightlist = [];
    let searchtable = await Course.find().sort({rate: -1});
    let searchlist = JSON.parse(JSON.stringify(searchtable));
    for(let i = 0; i < searchlist.length && i < 3; i++){      
        spotlightlist.push({
            _id: searchlist[i]['_id'], 
            course_name: searchlist[i]['course_name'], 
            brief_description: searchlist[i]['brief_description'], 
            rate: searchlist[i]['rate'],
            isActive: i===0});
    }

    let categoriestable = await Category.find();
    let subcategoriestable = [];

    let fulldata = [];
    let subdata = [];
    let temp = [];

    for(let i = 0; i < categoriestable.length; i++){   
        subcategoriestable = await SubCategory.find({category: categoriestable[i]['_id']});
        subdata = [];
        for (let j = 0; j < subcategoriestable.length; j++){
            temp = await Course.find({category: subcategoriestable[j]['_id']});
            for(let k = 0; k < temp.length; k++){
                subdata.push(JSON.parse(JSON.stringify(temp[k])));
            }
        }
        fulldata.push(subdata);
    }

    let biglist = [];
    let viewlist = [];
    let newlist = [];

    let count = 0;
    let page = 0;
    //loop tất cả lĩnh vực
    for(let i = 0; i < fulldata.length; i++){      
        //console.log(categorieslist[i]);

        //xem nhiều nhất của 1 lĩnh vực
        fulldata[i].sort(function(a, b){
            return b.view_counts - a.view_counts;
        });

        let subviewlist = [];
        count = 0;
        page = 0;
        let item = [];
        for(let j = 0; j < fulldata[i].length && j < 10; j++){ 
            console.log(fulldata[i][j].view_counts);
            item.push(fulldata[i][j]);
            count++;
            if(count == 5) {
                subviewlist.push({item: item});
                viewlist.push({subviewlist: subviewlist, isActive: page === 0});
                count = 0;
                page++;
                subviewlist = [];
                item = [];
            };
        }
        if(item.length != 0) {
            subviewlist.push({item: item});
            viewlist.push({subviewlist: subviewlist, isActive: page === 0});
        }
            

        //mới nhất của 1 lĩnh vực
        fulldata[i].sort(function(a, b){
            return b._id - a._id;
        });

        let subnewlist = [];
        item = [];
        count = 0;
        page = 0;
        for(let j = 0; j < fulldata[i].length && j < 10; j++){ 
            item.push(fulldata[i][j]);
            count++;
            if(count == 5) {
                subnewlist.push({item: item});
                newlist.push({subnewlist: subnewlist, isActive: page === 0});
                count = 0;
                page++;
                subnewlist = [];
                item = [];
            };
        }
        if(item.length != 0){
            subnewlist.push({item: item});
            newlist.push({subnewlist: subnewlist, isActive: page === 0});
        }
            

        //list to gồm 10 cate, mỗi cate có 1 viewlist, 1 newlist và 1 title
        biglist.push({viewlist: viewlist, viewempty: newlist.length === 0,  newlist: newlist, newempty: newlist.length === 0, title: categoriestable[i].title, id: i});
        viewlist = [];
        newlist = [];
    }

    for(let i = 0; i < biglist.length; i++){ 
        //console.log(biglist[i]);
    }

    let mostredisteredlist = [];

    

    res.render('home', {
        spotlightlist: spotlightlist,
        mostredisteredlist: mostredisteredlist,
        biglist: biglist,
    });
  });

export default router;