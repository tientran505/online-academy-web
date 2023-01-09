import Course from '../utils/models/course.model.js';
import User from '../utils/models/user.model.js';
import Section from '../utils/models/section.model.js';
import Lecture from '../utils/models/lecture.model.js';

export default {
    async findAll() {
        const p = await Course.find();
        const list =  JSON.parse(JSON.stringify(p));
        for(const c of list){
            if(c.author) {
                const u = await User.findOne({_id: c.author});
                const l = JSON.parse(JSON.stringify(u));
                
               
                if(l.name !== null)
                    c.author = l.name;
                else c.author = "";
            }
        }
       return list;
    },
    async findWithCategory(cate){
        const p = await Course.find({category: cate});
        const list =  JSON.parse(JSON.stringify(p));
        for(const c of list){
            if(c.author) {
                const u = await User.findOne({_id: c.author});
                const l = JSON.parse(JSON.stringify(u));
                if(l.name !== null)
                    c.author = l.name;
                else c.author = "";
            }
        }
        return list;
    },
    async findCondition(offset,limit){
        const p = await Course.find().skip(offset).limit(limit);
        const list =  JSON.parse(JSON.stringify(p));
        for(const c of list){
            if(c.author) {
                const u = await User.findOne({_id: c.author});
                const l = JSON.parse(JSON.stringify(u));
                if(l.name !== null)
                    c.author = l.name;
                else c.author = "";
            }
        }
        return list;
    },
    async findConditionCategory(cate,offset,limit){
        const p = await Course.find({category: cate}).skip(offset).limit(limit);
        const list =  JSON.parse(JSON.stringify(p));
        for(const c of list){
            if(c.author) {
                const u = await User.findOne({_id: c.author});
                const l = JSON.parse(JSON.stringify(u));
                if(l.name !== null)
                    c.author = l.name;
                else c.author = "";
            }
        }
        return list;
    },
    async loadSectionLecture(courseId) {

        const p = await Section.find({course_id: courseId}).populate('lectures');
        const list =  JSON.parse(JSON.stringify(p));
       return list;
    },

    patch(id, disable) {
        return Course.findByIdAndUpdate(id, { disable });
    },
};
