Tombloo.Service.extractors.register([
	{
		name : 'Photo - LDR(pixiv)',
		ICON : 'http://www.pixiv.net/favicon.ico',
		illustURL : /^http:\/\/www\.pixiv\.net\/member_illust.php\?mode=/,
		check : function(ctx){
			var item = Tombloo.Service.extractors.LDR.getItem(ctx, true);
			return item &&
				ctx.onImage &&
				item.href.match(this.illustURL);
		},
		extract : function(ctx){
			var hostURL = 'http://www.pixiv.net/';
			var mangaURL =  /^http:\/\/www\.pixiv\.net\/member_illust.php\?mode=manga/;
			var item = Tombloo.Service.extractors.LDR.getItem(ctx);

			return request(item.href).addCallback(function(res){
				var responseHTML = convertToHTMLDocument(res.responseText);
				return {
					title : $x('//title/text()', responseHTML),
					src   : $x("id('tag_area')/following-sibling::*/a[contains(@href,'mode=')]/img/@src",responseHTML),
					link  : hostURL + $x("id('tag_area')/following-sibling::*/a[contains(@href,'mode=')]/@href",responseHTML),
				}
			}).addCallback(function(target){
				if(target.link.match(mangaURL)){
					var itemUrl = target.src.replace(/_(?:m|s|100)\.([^.]+)$/,'_p0.$1');
				}else{
					var itemUrl = target.src.replace(/_(?:m|s|100)\.([^.]+)$/,'.$1');
				}

				return download(itemUrl, getTempDir(), false).addCallback(function(file){
					return {
						type	: 'photo',
						item	: target.title,
						itemUrl : itemUrl,
						page    : target.title,
						pageUrl : item.href,
						file	: file,
					}
				});
			});
		}
	}
],'Photo - LDR');
