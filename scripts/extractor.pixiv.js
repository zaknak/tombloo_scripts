Tombloo.Service.extractors.register([
	{
		name : 'photo - pxiv',
		ICON : 'chrome://tombloo/skin/photo.png',
		check : function(ctx){
			return ctx.onImage && ctx.imageURL.match(/^http:\/\/img\d.+?\.pixiv\.net\/img\//);
		},
		extract : function(ctx){
			illustURL = /^http:\/\/www\.pixiv\.net\/member_illust.php\?mode=/;
			itemUrl = ctx.target.src.replace(/_(?:m|s)\.([^.]+)$/,'.$1')

			if(ctx.document.contentType.match(/^image/))
				ctx.title = ctx.href.split('/').pop();
			return download(itemUrl, getTempDir(), false).addCallback(function(file){
				if(ctx.onLink && ctx.linkURL.match(illustURL) && !ctx.href.match(illustURL)){
					return request(ctx.linkURL).addCallback(function(res){
						ctx.title = $x('//title/text()',convertToHTMLDocument(res.responseText));
						return {
							type	: 'photo',
							item	: ctx.title,
							itemUrl : itemUrl,
							pageUrl : ctx.linkURL,
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
