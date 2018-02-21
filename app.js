var express=require('express');
var bodyParser = require('body-parser');
var app=express();
var request=require('request');
var cheerio=require('cheerio');
var port=process.env.port || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
const hbs=require('hbs');
app.set('view engine','hbs');
app.get('/',(req,res)=>{
    res.render('home.hbs');
});

 // API to search for specific keyword
 
app.post('/nodeapi/search_for_keyword',(req,res)=>{
 
    var entered_keyword=req.body.keyword;  // we are fetching keyword from request body
    var found_places=[];
    var word_counter=[];
    var occured_times=0;  // varaible to count occurance of keyword

    // keyword url will be dynamic url which will search for any mentioned keywords.
    var keyword_url=`http://www.ema.europa.eu/ema/index.jsp?curl=search.jsp&q=${entered_keyword}&btnG=Search&mid=`
    request(keyword_url,function(err,response,body){
    var query = require('url').parse(keyword_url,true).query;  //parse the url
   
    var keyword=query.q;   // fetch the keyword
   // if there is no error,only then proceed
    if(!err){
            var $ = cheerio.load(body); // loaded the body of page using cheerio
       
            $('p.s','#content').each(function(){
                var word=$(this);
                var sentence=word.text();
                //console.log(sentence);
                var data= (countOccurances(sentence, keyword));
                occured_times=occured_times+data;
                found_places.push("\n" + sentence);  //push the keyword containing sentences in array.
            });       
    }
    //Render response page
    res.render('keyword.hbs',{keyword:keyword,occured_times:occured_times,found_places:found_places});
   
});
});
//function to find count of keyword
function countOccurances(main_str, sub_str) 
    {
    main_str += '';
    sub_str += '';

    if (sub_str.length <= 0) 
    {
        return main_str.length + 1;
    }

       subStr = sub_str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
       return (main_str.match(new RegExp(subStr, 'gi')) || []).length;
    }

app.listen(port,()=>{
    console.log('Connected Successfully');
})