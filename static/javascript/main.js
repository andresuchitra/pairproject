var mincount = 9;
var maxcount = 18;

$(window).scroll(function() 
{
    if($(window).scrollTop() + $(window).height() >= $(document).height() - 400) 
    {
        $("#productList li").slice(mincount,maxcount).fadeIn(1200);

        mincount = mincount+9;
        maxcount = maxcount+9;
    }
});