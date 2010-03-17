Tombloo.Service.extractors.register([
	{
		name : 'Photo - pxiv',
		ICON : 'http://www.pixiv.net/favicon.ico',
		check : function(ctx){
			return ctx.onImage && ctx.target.src.match(/^http:\/\/img\d.+?\.pixiv\.net\/img\//);
		},
		extract : function(ctx){
			illustURL = /^http:\/\/www\.pixiv\.net\/member_illust.php\?mode=/;
			itemUrl = ctx.target.src.replace(/_(?:m|s)\.([^.]+)$/,'.$1')

			if(ctx.document.contentType.match(/^image/))
				ctx.title = ctx.href.split('/').pop();
			return download(itemUrl, getTempDir(), false).addCallback(function(file){
				if(ctx.onLink && ctx.link.href.match(illustURL) && !ctx.href.match(illustURL)){
					return request(ctx.link.href).addCallback(function(res){
						ctx.title = $x('//title/text()',convertToHTMLDocument(res.responseText));
						return {
							type	: 'photo',
							item	: ctx.title,
							itemUrl : itemUrl,
							pageUrl : ctx.link.href,
							file	: file,
						}
					});
				}else{
					return {
						type	: 'photo',
						item	: ctx.title,
						itemUrl : itemUrl,
						file	: file,
					}
				}
			});
		  }
	}
],'Photo');
