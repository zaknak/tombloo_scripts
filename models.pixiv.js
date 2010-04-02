models.register(update({
	name : 'pixiv',
	ICON : 'http://www.pixiv.net/favicon.ico',
	check : function(ps){
		return (/(photo|link)/).test(ps.type) && ps.pageUrl.match(/^http:\/\/www\.pixiv\.net\/member_illust\.php/);
	},
	getToken : function(){
		var status = this.updateSession();
		switch (status){
		case 'none':
			throw new Error(getMessage('error.notLoggedin'));
		case 'same':
			if(this.token)
				return succeed(this.token);
		case 'changed':
			var self = this;
			return request('http://www.pixiv.net/bookmark.php').addCallback(function(res){
					return self.token = $x(
					'//form[@id="f"]/input[@name="tt"]/@value',
					convertToHTMLDocument(res.responseText));
			});
		}
	},
	getAuthCookie : function(){
		//仮に設定。PHPSESSIDでは正しく判定出来ない。
		return getCookieString('pixiv.net', 'PHPSESSID');
	},
	post : function(ps){
		return this.getToken().addCallback(function(token){
				return request('http://www.pixiv.net/bookmark_add.php', {
					sendContent  : {
						mode	 : 'add',
						tt		 : token,
						id		 : ps.pageUrl.match(/illust_id=(\d+)/)[1],
						type	 : 'illust',
						restrict : 0,		 //1 で非公開
						tag		 : ps.tags ? ps.tags.join(' '): '',
						comment  : joinText([ps.body, ps.description], ' ', true),
					},
				});
			});
	}
}, AbstractSessionService));
