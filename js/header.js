function myHeader() {
    // Create header elements
    const header = document.createElement('header');
    const h4 = document.createElement('h4');
    const h1 = document.createElement('h1');
    const nav = document.createElement('nav');
    const ul = document.createElement('ul');

    // Set attributes and text content
    h4.setAttribute('id', 'bsd');
    h4.textContent = 'בסייעתא דשמיא';

    h1.setAttribute('id', 'titleHeader');
    h1.textContent = '🐔 מערכת הגדרות מתקדמות';

    // Create list items
    const menuItems = [
        { href: '/YemotSettings/', text: 'דשבורד ראשי' },
        { href: '#services', text: 'ניהול תבניות' },
        { href: '/YemotSettings/TemplateEditor.html', text: 'יצירת תבנית' },
        { href: '/YemotSettings/BuildingSystem.html', text: 'אפיון מערכת' },
        { href: '/YemotSettings', text: 'הגדרות' },
        { href: '#contact', text: 'צור קשר' }
    ];

    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('href', item.href);
        a.textContent = item.text;
        li.appendChild(a);
        ul.appendChild(li);
    });

    // Append elements to the header
    header.appendChild(h4);
    header.appendChild(h1);
    nav.appendChild(ul);
    header.appendChild(nav);

    // Append header to the "myHeader" div
    const myHeaderDiv = document.getElementById('myHeader');
    myHeaderDiv.appendChild(header);

    //const mynotificationHeaderDiv = document.getElementById('notificationHeaderText');
    //mynotificationHeaderDiv.textContent = "האתר עדיין בפיתוח... 🔨 כפתורי העדכון מרובה השלוחות ושמירת ההגדרות לתבנית עדיין אינם פעילים. ליצירת קשר, הערות והארות ניתן לשלוח מייל לcs@abaye.co";
    //mynotificationHeaderDiv.style.display = 'block';
}