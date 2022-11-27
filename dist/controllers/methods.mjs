import e from"fs";import{execSync as k}from"child_process";import{JSDOM as w}from"jsdom";export default class F{constructor(s){this.socket=s}createDashboardData=()=>{const s={name:JSON.parse(e.readFileSync("./package.json","utf-8")).title,version:JSON.parse(e.readFileSync("./package.json","utf-8")).version,theme:process.env.npm_package_title,pages:e.readdirSync("../../src/pages","utf8").filter(o=>o.match(/.(hbs)$/i)).filter(o=>!o.match(/blog-page/g)&&!o.match(/blog-find/g)).length,posts:e.readdirSync("../../src/data/blog/posts","utf8").length,authors:JSON.parse(e.readFileSync("../../src/data/setting.json","utf8")).authors.length};this.socket.emit("dashboardData",s)};createPagesData=()=>{e.readdir("../../src/pages",(s,o)=>{const t=o.filter(a=>a.match(/.(hbs)$/i)).filter(a=>!a.match(/blog-page/g)&&!a.match(/blog-find/g)).map(a=>({page:a.split(".").slice(0,-1).join("."),title:e.readFileSync(`../../src/pages/${a}`,"utf8").match(/(?<=title:\s).*/g)[0],date:e.statSync(`../../src/pages/${a}`).mtime,layout:e.readFileSync(`../../src/pages/${a}`,"utf8").match(/(?<=layout:\s).*/g)[0],breadcrumb:e.readFileSync(`../../src/pages/${a}`,"utf8").match(/(?<=breadcrumb:\s).*/g)[0],sections:e.readFileSync(`../../src/pages/${a}`,"utf8").match(/{{>(.*?)}}*/g).map(i=>i.substring(4).slice(0,-3))}));this.socket.emit("pagesData",t)}),e.readFile("../../src/data/setting.json","utf8",(s,o)=>{const t=JSON.parse(o).blog.asBlog!==!1?JSON.parse(o).blog.asBlog.split(".")[0]:!1;this.socket.emit("pagesCurrentBlog",t)})};createPagesActionData=()=>{e.readdir("templates",(s,o)=>{const t=o.filter(r=>r.match(/.(hbs)$/i)),a=e.readdirSync("../../src/hooks/sections","utf-8").filter(r=>!r.includes("blog")).filter(r=>r.match(/.(hbs)$/i)),i=this.utilCheckHook()&&a.length!==0?a:!1,c={name:`Exclusive - ${i!==!1?i[0].split("-")[1].charAt(0).toUpperCase()+i[0].split("-")[1].slice(1):"empty"}`,sections:i,icon:"fa-award"},l=[{name:"Card",sections:t.filter(r=>r.includes("card")),icon:"fa-sticky-note"},{name:"Client logo",sections:t.filter(r=>r.includes("client-logo")),icon:"fa-shapes"},{name:"Contact",sections:t.filter(r=>r.includes("contact")),icon:"fa-map-marker-alt"},{name:"Content",sections:t.filter(r=>r.includes("content")),icon:"fa-file-alt"},{name:"Counter",sections:t.filter(r=>r.includes("counter")),icon:"fa-hourglass-half"},{name:"Faq",sections:t.filter(r=>r.includes("faq")),icon:"fa-question"},{name:"Feature",sections:t.filter(r=>r.includes("feature")),icon:"fa-cubes"},{name:"Gallery",sections:t.filter(r=>r.includes("gallery")),icon:"fa-images"},{name:"Pricing",sections:t.filter(r=>r.includes("pricing")),icon:"fa-money-bill-wave"},{name:"Slideshow",sections:t.filter(r=>r.includes("slideshow")),icon:"fa-layer-group"},{name:"Team",sections:t.filter(r=>r.includes("team")),icon:"fa-users"},{name:"Testimonial",sections:t.filter(r=>r.includes("testimonial")),icon:"fa-comment-dots"},{name:"Timeline",sections:t.filter(r=>r.includes("timeline")),icon:"fa-history"},{name:"Utility",sections:t.filter(r=>r.includes("utility")),icon:"fa-screwdriver-wrench"}];i!==!1&&l.splice(5,0,c),this.socket.emit("pagesActionData",l)})};pagesDeletePage=(s,o)=>{e.readFile(`../../src/pages/${s}.hbs`,"utf8",(t,a)=>{a.match(/(?<=as_blog:\s).*/g)[0]=="false"?(e.unlinkSync(`../../dist/${s}.html`),e.unlinkSync(`../../src/pages/${s}.hbs`),o!==void 0&&o.forEach(n=>!n.includes("section-slideshow")&&e.unlinkSync(`../../src/partials/sections/${n}.hbs`))):(e.unlinkSync(`../../dist/${s}.html`),e.unlinkSync(`../../src/pages/${s}.hbs`),e.unlinkSync("../../dist/blog-find.html"),e.unlinkSync("../../src/pages/blog-find.hbs"),e.readdir("../../src/pages",(n,c)=>{c.filter(l=>l.match(/.(hbs)$/i)).filter(l=>l.match(/blog-page/g)).forEach(l=>{e.unlinkSync(`../../dist/${l.split(".").slice(0,-1)[0]}.html`),e.unlinkSync(`../../src/pages/${l}`)})}),e.readFile("../../src/data/setting.json","utf8",(n,c)=>{const l=JSON.parse(c);l.blog.asBlog=!1,e.writeFileSync("../../src/data/setting.json",JSON.stringify(l,null,2)),this.socket.emit("pagesCurrentBlog",l.blog.asBlog)}),e.readFile("../../src/assets/js/utilities/breadcrumb.js","utf8",(n,c)=>{const l=c.replace(/(?<=this\.blogPath\s\=\s).*/g,!1);e.writeFileSync("../../src/assets/js/utilities/breadcrumb.js",l)}),e.readFile("../../src/assets/js/utilities/active-menu.js","utf8",(n,c)=>{const l=c.replace(/(?<=this\.blogPath\s\=\s).*/g,!1);e.writeFileSync("../../src/assets/js/utilities/active-menu.js",l)}))})};pagesSavePage=(s,o,t)=>{o?e.readFile("../../src/data/setting.json","utf8",(a,i)=>{const n=JSON.parse(i);n.blog.asBlog=`${s}.hbs`,e.writeFileSync("../../src/data/setting.json",JSON.stringify(n,null,2)),e.readFile("../../src/assets/js/utilities/breadcrumb.js","utf8",(r,d)=>{const f=d.replace(/(?<=this\.blogPath\s\=\s).*/g,`'${s}.html'`);e.writeFileSync("../../src/assets/js/utilities/breadcrumb.js",f)}),e.readFile("../../src/assets/js/utilities/active-menu.js","utf8",(r,d)=>{const f=d.replace(/(?<=this\.blogPath\s\=\s).*/g,`'${s}.html'`);e.writeFileSync("../../src/assets/js/utilities/active-menu.js",f)});function c(r){const m=e.readFileSync(r,"utf8").replace(/(?<=layout:\s).*/g,t.layout).replace(/(?<=title:\s).*/g,t.title).replace(/(?<=breadcrumb:\s).*/g,t.breadcrumb);e.writeFileSync(r,m)}e.existsSync("../../src/hooks/pages/blog.hbs")?c("../../src/hooks/pages/blog.hbs"):c("hooks/pages/blog.hbs"),e.existsSync("../../src/hooks/pages/blog-single.hbs")?c("../../src/hooks/pages/blog-single.hbs"):c("hooks/pages/blog-single.hbs"),e.existsSync("../../src/hooks/pages/blog-find.hbs")?c("../../src/hooks/pages/blog-find.hbs"):c("hooks/pages/blog-find.hbs"),e.readdir("../../src/pages/blog",(r,d)=>{d.forEach(f=>c(`../../src/pages/blog/${f}`))}),e.readFile("../../src/data/blog/blog.json","utf8",(r,d)=>{const f=JSON.parse(d),b={defaultPage:e.existsSync("../../src/hooks/pages/blog.hbs")?e.readFileSync("../../src/hooks/pages/blog.hbs","utf8"):e.readFileSync("hooks/pages/blog.hbs","utf8"),singlePage:e.existsSync("../../src/hooks/pages/blog-single.hbs")?e.readFileSync("../../src/hooks/pages/blog-single.hbs","utf8"):e.readFileSync("hooks/pages/blog-single.hbs","utf8"),defaultSection:e.existsSync("../../src/hooks/sections/section-blog.hbs")?e.readFileSync("../../src/hooks/sections/section-blog.hbs","utf8"):e.readFileSync("hooks/sections/section-blog.hbs","utf8"),singleSection:e.existsSync("../../src/hooks/sections/section-blog-single.hbs")?e.readFileSync("../../src/hooks/sections/section-blog-single.hbs","utf8"):e.readFileSync("hooks/sections/section-blog-single.hbs","utf8")};this.postPaginatorPage(f,b)});const l=e.existsSync("../../src/hooks/pages/blog-find.hbs")?"../../src/hooks/pages/blog-find.hbs":"hooks/pages/blog-find.hbs";e.readFile(l,"utf8",(r,d)=>{const m=d.replace(/(?<=layout:\s).*/g,t.layout).replace(/(?<=title:\s).*/g,t.title).replace(/(?<=breadcrumb:\s).*/g,t.breadcrumb);e.writeFileSync("../../src/pages/blog-find.hbs",m)})}):e.writeFileSync(`../../src/pages/${s}.hbs`,t)};readSectionData=s=>{const o=s.split("-").length>=4?`../../src/partials/sections/${s}.hbs`:`templates/${s}.hbs`;e.readFile(o,"utf8",(t,a)=>{const i={blocks:[{id:s,type:"code",data:{language:"HTML",text:a}}]};this.socket.emit("resultSectionData",i)})};createSectionData=(s,o)=>{s.forEach(t=>{e.readFile(`templates/${t.reference}.hbs`,"utf8",(a,i)=>{i.includes("<!-- slideshow content begin -->")?e.writeFileSync(`../../src/partials/sections/${t.reference}.hbs`,t.updateData!==!1?t.updateData:i):e.writeFileSync(`../../src/partials/sections/${t.reference}-${t.id}.hbs`,t.updateData!==!1?t.updateData:i)})}),(o.length!==0||o[0]!==!1)&&o.forEach(t=>{try{e.existsSync(`../../src/partials/sections/${t}.hbs`)&&e.unlinkSync(`../../src/partials/sections/${t}.hbs`)}catch(a){console.error(`file not found: ${a}`)}})};createPostsData=()=>{e.readdir("../../src/data/blog/posts",(s,o)=>{const t=o.map(a=>{const i=JSON.parse(e.readFileSync(`../../src/data/blog/posts/${a}`,"utf8"));return{title:i.title,link:i.link,dateCreated:i.dateCreated,dateModified:i.dateModified,timeCreated:i.timeCreated,timeModified:i.timeModified,author:i.author,category:i.category}});this.socket.emit("postsData",t)})};createPostsActionData=s=>{const o=JSON.parse(e.readFileSync("../../src/data/setting.json","utf8")),t=s!=="empty"?JSON.parse(e.readFileSync(`../../src/data/blog/posts/${s}.json`,"utf8")):null,a={authors:{current:t!==null?t.author.name:"",select:o.authors},categories:{current:t!==null?t.category:"",select:o.blog.categories},currentTags:t!==null?t.tags:"",currentImage:t!==null?t.image:!1,title:t!==null?t.title:"",dateCreated:t!==null?t.dateCreated:"",timeCreated:t!==null?t.timeCreated:"",blocks:t!==null?t.blocks:""};this.socket.emit("postsActionData",a)};postPaginatorWidget=(s,o,t,a)=>{let i=o||1,n=t||10,c=(i-1)*n,l=s.slice(c).slice(0,t),r=Math.ceil(s.length/n);return{page:i,per_page:n,prev_page:i-1?i-1:null,next_page:r>i?i+1:null,total_post:s.length,total_pages:r,display_author:a.blog.displayAuthor,data:l}};postPaginatorPage=(s,o)=>{const t=JSON.parse(e.readFileSync("../../src/data/setting.json","utf8"));setTimeout(()=>{const a=t.blog.postPerPage,n=this.postPaginatorWidget(s.post,1,a,t).total_pages;if(t.blog.asBlog!==!1){let g=1;for(;g<=n;){const u=`blog-page-${g}`,C=this.postPaginatorWidget(s.post,g,a,t);e.writeFileSync(`../../src/data/blog/${u}.json`,JSON.stringify(C,null,2));const p=o.defaultPage.replace(/(?<={{> section-blog-)(.*?)(?= }})/g,g);g==1?e.writeFileSync(`../../src/pages/${t.blog.asBlog}`,p):e.writeFileSync(`../../src/pages/blog-page-${g}.hbs`,p);const y=o.defaultSection.replace(/{{#each(.*?).data}}/g,`{{#each blog-page-${g}.data}}`).replace(/{{#if(.*?).display_author}}/g,`{{#if @root.blog-page-${g}.display_author}}`);e.writeFileSync(`../../src/partials/blog/section-blog-${g}.hbs`,y),g++}}e.readdir("../../src/data/blog",(g,u)=>{const C=u.filter(y=>y.match(/(blog-page-)/g));let p=n+1,h=C.length;for(;p<=h;)e.existsSync(`../../src/data/blog/blog-page-${p}.json`)&&e.unlinkSync(`../../src/data/blog/blog-page-${p}.json`),e.existsSync(`../../src/pages/blog-page-${p}.hbs`)&&e.unlinkSync(`../../src/pages/blog-page-${p}.hbs`),e.existsSync(`../../dist/blog-page-${p}.html`)&&e.unlinkSync(`../../dist/blog-page-${p}.html`),p++}),e.readdir("../../src/partials/blog",(g,u)=>{const C=u.filter(h=>h.match(/section-blog/g)).sort((h,y)=>h.length-y.length).filter((h,y)=>y<n);u.filter(h=>h.match(/section-blog/g)).filter(h=>!C.includes(h)).forEach(h=>{e.existsSync(`../../src/partials/blog/${h}`)&&e.unlinkSync(`../../src/partials/blog/${h}`)})});const c=[];for(let g=0;g<3;g++)c.push({title:s.post[g].title,link:s.post[g].link,date:s.post[g].dateCreated});const r=s.post.map(g=>g.tags).filter(g=>g).reduce((g,u)=>g.concat(u),[]).map(g=>g),d=r.filter((g,u)=>r.indexOf(g)==u),f=s.post.map(g=>g.category),b=f.filter((g,u)=>f.indexOf(g)==u),S={asBlog:t.blog.asBlog!==!1?`${t.blog.asBlog.split(".").slice(0,-1)}.html`:!1,totalPages:n,tagLists:d,latestPost:c};e.writeFileSync("../../dist/blog/data/data-blog.json",JSON.stringify(S)),e.readFile("../../src/data/blog/blog.json","utf8",(g,u)=>{const C=JSON.parse(u),p=b.map(h=>this.createCategoryPost(C.post,h));e.writeFileSync("../../dist/blog/data/data-category.json",JSON.stringify(p))}),e.readFile("../../src/data/blog/blog.json","utf8",(g,u)=>{const C=JSON.parse(u),p=d.map(h=>this.createTagPost(C.post,h));p.forEach(h=>{h.posts.forEach(y=>{delete y.tags,delete y.blocks})}),e.writeFileSync("../../dist/blog/data/data-tag.json",JSON.stringify(p))})},600)};createCategoryPost=(s,o)=>{const t=s.filter(a=>a.category===o);return t.forEach(a=>{a.content=this.utilTrimString(a.blocks[0].data.text),a.date=a.dateCreated,delete a.author.id,delete a.blocks,delete a.share,delete a.category,delete a.tags,delete a.dateCreated,delete a.timeCreated,a.image||delete a.image}),{category:o,totalPost:t.length,posts:t}};createTagPost=(s,o)=>{const t=[];return s.forEach(a=>{a.tags.filter(i=>{i===o&&t.push(a)})}),t.forEach(a=>{a.content=this.utilTrimString(a.blocks[0].data.text),a.date=a.dateCreated!==void 0?a.dateCreated:a.date,delete a.author.id,delete a.share,delete a.dateCreated,delete a.timeCreated,a.image||delete a.image}),{tag:o,totalPost:t.length,posts:t}};postCreatePage=s=>{e.readdir("../../src/data/blog/posts",(o,t)=>{const a={post:t.map(i=>JSON.parse(e.readFileSync(`../../src/data/blog/posts/${i}`,"utf8")))};a.post.sort((i,n)=>new Date(`${n.dateCreated} ${n.timeCreated}`)-new Date(`${i.dateCreated} ${i.timeCreated}`)),e.readFile("../../src/data/blog/blog.json","utf-8",(i,n)=>{const c=JSON.parse(n).post.map(r=>(delete r.dateModified,delete r.timeModified,r)),l=a.post.map(r=>(delete r.dateModified,delete r.timeModified,r));JSON.stringify(c)!==JSON.stringify(l)&&e.writeFileSync("../../src/data/blog/blog.json",JSON.stringify(a,null,2))}),this.postPaginatorPage(a,s)})};postsSaveContent=async(s,o,t)=>{e.unlink("../../dist/blog/*.html",a=>{e.writeFileSync(`../../src/data/blog/posts/${s}.json`,JSON.stringify(o,null,2));const i=t.singleSection.replace(/(post-title)/g,s);e.writeFileSync(`../../src/partials/blog/post-title-${s}.hbs`,i);const n=t.singlePage.replace(/(?<={{> post-title)(.*?)(?= }})/g,`-${s}`);e.writeFileSync(`../../src/pages/blog/${s}.hbs`,n),this.postCreatePage(t)})};postsDeletePost=(s,o)=>{const t=[`../../src/data/blog/posts/${s}.json`,`../../src/pages/blog/${s}.hbs`,`../../src/partials/blog/post-title-${s}.hbs`,`../../dist/blog/${s}.html`];return Promise.all(t.map(a=>{e.unlinkSync(a)})).then(this.socket.emit("deleteDone","success"),this.postCreatePage(o))};createEditorData=s=>{e.readFile(`../../src/data/blog/posts/${s}.json`,"utf8",(o,t)=>this.socket.emit("editorData",t))};postsTagSources=()=>{const s={defaultPage:e.existsSync("../../src/hooks/pages/blog.hbs")?e.readFileSync("../../src/hooks/pages/blog.hbs","utf8"):e.readFileSync("hooks/pages/blog.hbs","utf8"),singlePage:e.existsSync("../../src/hooks/pages/blog-single.hbs")?e.readFileSync("../../src/hooks/pages/blog-single.hbs","utf8"):e.readFileSync("hooks/pages/blog-single.hbs","utf8"),defaultSection:e.existsSync("../../src/hooks/sections/section-blog.hbs")?e.readFileSync("../../src/hooks/sections/section-blog.hbs","utf8"):e.readFileSync("hooks/sections/section-blog.hbs","utf8"),singleSection:e.existsSync("../../src/hooks/sections/section-blog-single.hbs")?e.readFileSync("../../src/hooks/sections/section-blog-single.hbs","utf8"):e.readFileSync("hooks/sections/section-blog-single.hbs","utf8")};this.socket.emit("tagSourcesData",s)};findBlogTitle=(s,o,t)=>{if(s.hasOwnProperty(o)&&s[o]===t)return s;for(const a of Object.keys(s))if(typeof s[a]=="object"){const i=this.findBlogTitle(s[a],o,t);if(i!==null&&typeof i<"u")return i}return null};createBlogTitle=s=>{if(this.findBlogTitle(s,"link","blog/page-1.html")!==null){const o=this.findBlogTitle(s,"link","blog/page-1.html").title;e.readdir("../../src/pages/blog",(t,a)=>{a.forEach(i=>{e.readFile(`../../src/pages/blog/${i}`,"utf8",(n,c)=>{const r=c.replace(/(?<=data-title=")([^"]*)/g,o.toLowerCase()).replace(/(?<=title:\s).*/g,o);e.writeFileSync(`../../src/pages/blog/${i}`,r)})})})}};createNavigationData=()=>{const s={nav:JSON.parse(e.readFileSync("../../src/data/navigation.json","utf8")).nav,select:e.readdirSync("../../src/pages","utf8").filter(o=>!o.match(/blog-page/g)&&!o.match(/blog-find/g)).filter(o=>o.match(/.(hbs)$/i))};this.socket.emit("navigationData",s)};saveNavigationData=s=>{e.writeFileSync("../../src/data/navigation.json",JSON.stringify(s,null,2)),this.createBlogTitle(s)};assetsUpload=(s,o)=>{e.writeFile(`../../dist/img/user/${o}`,s,t=>{this.socket.emit("uploadDone",`img/user/${o}`)})};assetsDelete=s=>{e.unlink(`../../dist/img/user/${s}`,o=>{this.socket.emit("deleteDone","success")})};saveSettingsData=(s,o)=>{e.readFile("../../src/assets/scss/_colors.scss","utf8",(t,a)=>{const i=a,u=i.replace(/(?<=primary:\s)([^;]*)/g,s.colors.primaryColor).replace(/(?<=secondary:\s)([^;]*)/g,s.colors.secondaryColor).replace(/(?<=success:\s)([^;]*)/g,s.colors.successColor).replace(/(?<=info:\s)([^;]*)/g,s.colors.infoColor).replace(/(?<=warning:\s)([^;]*)/g,s.colors.warningColor).replace(/(?<=danger:\s)([^;]*)/g,s.colors.dangerColor).replace(/(?<=light:\s)([^;]*)/g,s.colors.lightColor).replace(/(?<=dark:\s)([^;]*)/g,s.colors.darkColor).replace(/(?<=body-bg:\s)([^;]*)/g,s.colors.backgroundColor).replace(/(?<=body-color:\s)([^;]*)/g,s.colors.textColor).replace(/(?<=link-color:\s)([^;]*)/g,s.colors.linkColor);i!==u&&e.writeFileSync("../../src/assets/scss/_colors.scss",u)}),e.readFile("../../src/data/setting.json","utf-8",(t,a)=>{a!==JSON.stringify(s,null,2)&&e.writeFileSync("../../src/data/setting.json",JSON.stringify(s,null,2)),this.postCreatePage(o),this.updateAuthorData(a,s,o),this.runMinifying(a,s)})};runMinifying=(s,o)=>{const t=o.optimization.minifyAssets.css,a=o.optimization.minifyAssets.js,i=JSON.parse(s).optimization.minifyAssets.css!==t,n=JSON.parse(s).optimization.minifyAssets.js!==a;i&&t?k("gulp -S --f index.mjs minifyCss"):i&&!t&&k("gulp -S --f index.mjs compileCss"),n&&a?k("gulp -S --f index.mjs minifyJs"):n&&!a&&k("gulp -S --f index.mjs compileJs")};saveEmail=s=>{e.readFile("../../dist/sendmail.php","utf8",(o,t)=>{if(String(t.match(/(?<=emailTo = ).*/g))!==`"${s}";`){const i=t.replace(/(?<=emailTo = ).*/g,`"${s}";`);e.writeFileSync("../../dist/sendmail.php",i)}})};saveMap=s=>{e.readdir("../../src/partials/sections",(o,t)=>{t.filter(i=>i.match(/section-contact/g)).forEach(i=>{e.readFile(`../../src/partials/sections/${i}`,"utf8",(n,c)=>{const l=c.split(`
`)[0],r=new w(c),d=r.window.document.querySelector("iframe");if(d!==null){d.src=s;const f=l.concat(`
`,r.window.document.documentElement.childNodes[1].innerHTML);e.writeFileSync(`../../src/partials/sections/${i}`,f)}})})})};saveSocialMedia=()=>{e.existsSync("../src/hooks/components/social-media.mjs")?import("../../src/hooks/components/social-media.mjs").then(s=>s.default()):import("../hooks/components/social-media.mjs").then(s=>s.default())};saveFooter=()=>{e.existsSync("../src/hooks/components/footer.mjs")?import("../../src/hooks/components/footer.mjs").then(s=>s.default()):import("../hooks/components/footer.mjs").then(s=>s.default())};saveSlideshow=s=>{let o=e.readFileSync("hooks/slideshow/slideshow-wrapper.hbs","utf8");e.existsSync("../src/hooks/slideshow/slideshow-wrapper.hbs")&&(o=e.readFileSync("../src/hooks/slideshow/slideshow-wrapper.hbs","utf8"));const t=["section-slideshow-1.hbs","section-slideshow-2.hbs","section-slideshow-3.hbs","section-slideshow-4.hbs"],a=s.map((n,c)=>n.slides.length!==0?c:!1).filter(n=>n!==!1).map(n=>`section-slideshow-${n+1}.hbs`),i=t.filter(n=>!a.includes(n));s.forEach((n,c)=>{if(n.slides.length!==0){const l=n.slides.map(d=>d.text),r=o.replace(/\{{(.*slide-id)\}}/g,l.join(" "));e.writeFileSync(`templates/section-slideshow-${c+1}.hbs`,r),e.writeFileSync(`../../src/partials/sections/section-slideshow-${c+1}.hbs`,r)}}),e.readdir("templates",(n,c)=>{c.filter(l=>i.includes(l)).forEach(l=>{e.unlinkSync(`templates/${l}`),e.unlinkSync(`../../src/partials/sections/${l}`)})})};createSettingsData=()=>{e.readFile("../../src/data/setting.json","utf8",(s,o)=>this.socket.emit("settingsData",JSON.parse(o)))};createFooterData=()=>{e.readFile("../src/partials/components/component-footer.hbs","utf8",(s,o)=>{const t={blocks:[{id:"footer-content",type:"code",data:{language:"HTML",text:o}}]};this.socket.emit("footerData",t)})};saveFooterEditor=s=>{Object.keys(s).length!==0&&e.writeFileSync("../src/partials/components/component-footer.hbs",s)};createSlideItem=s=>{e.existsSync("../src/hooks/slideshow/slideshow-item.hbs")?this.createSlideData("../src/hooks/slideshow/slideshow-item.hbs",s):this.createSlideData("hooks/slideshow/slideshow-item.hbs",s)};createSlideData=(s,o)=>{e.readFile(s,"utf8",(t,a)=>{const i={blocks:[{id:o,type:"code",data:{language:"HTML",text:a}}]};this.socket.emit("slideItem",i)})};createComponentsData=()=>{e.readFile("../../src/data/component.json","utf8",(s,o)=>this.socket.emit("componentsData",JSON.parse(o)))};updateAuthorData=(s,o,t)=>{const a=JSON.parse(s).authors,i=o.authors,n=a.filter(this.utilCompareObj(i)),c=i.filter(this.utilCompareObj(a)),l=n.concat(c),r={post:[]};e.readdir("../../src/data/blog/posts",(d,f)=>{f.forEach(b=>{let m=JSON.parse(e.readFileSync(`../../src/data/blog/posts/${b}`,"utf8"));l.length!==0&&(Object.values(m).find(S=>{(S.id===l[0].id&&S.name!==l[1].name||S.id===l[0].id&&S.avatar!==l[1].avatar)&&(S.name=l[1].name,S.avatar=l[1].avatar)}),e.writeFileSync(`../../src/data/blog/posts/${b}`,JSON.stringify(m,null,2))),r.post.push(m)}),r.post.sort((b,m)=>new Date(`${m.dateCreated} ${m.timeCreated}`)-new Date(`${b.dateCreated} ${b.timeCreated}`)),e.writeFileSync("../../src/data/blog/blog.json",JSON.stringify(r,null,2)),this.postPaginatorPage(r,t)})};saveComponentsData=s=>{e.writeFileSync("../../src/data/component.json",JSON.stringify(s,null,2)),this.saveEmail(s.contactMap.email),this.saveMap(s.contactMap.mapSrc),this.saveSlideshow(s.slideshow),this.saveFooter(),this.saveSocialMedia()};utilCompareObj=s=>function(o){return s.filter(function(t){return t.name==o.name&&t.email==o.email&&t.role==o.role&&t.avatar==o.avatar}).length==0};utilTrimString(s){let o=s.indexOf(" ",150);return o==-1?s:s.substring(0,o)+" ..."}utilCheckHook(){return e.readdirSync("../../src/hooks","utf-8").length!==0}utilEnvPort=()=>{const s=JSON.parse(e.readFileSync("../../src/hooks/settings/env.json","utf-8"));this.socket.emit("envPortData",s)}}
