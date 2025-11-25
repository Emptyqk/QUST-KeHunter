#include <iostream>
#include <vector>
#include <queue>
using namespace std;
class Node{
    public:
        char data;
        vector<Node*> children;
}
class Tree{
   private:
        Node* root;
        Node *create(){
            char val;
            cin>>val;
            if(val=='#'){
                return NULL;
            }
            Node* node = new Node(val);
            int n;
            cin>>n;
            for(int i=0;i<n;i++){
                node->children.push_back(create());
            }
            return node;
        }
        void pretra(Node* node){
            cout<<node->val<<" ";
            for(Node* child:node->children){
                pretra(child);
            } 
        }
        void posttra(Node* node){
            for(Node* child:node->children){
                posttra(child);
            }
            cout<<node->val<<" "; 
        }
        void leveltra(Node* node){
          queue<Node*> q;
          q.push(node);
          while(!q.empty()){
            Node* current = q.front();
            q.pop();
            cout<<current->val<<" ";
            for(Node* child:current->children){
                q.push(child);
            }
          }
           cout<<endl; 
        }
        int depth(Node* node){
            int maxdepth = 0;
            for(Node* child:node->children){
                int dep;
                dep = depth(child);
                if(dep>maxdepth){
                    maxdepth = dep; 
                }
            }
            return maxdepth+1;
        }
        Node* findnode(Node* node,char val){
            if(node->val==val){
                return node;
            }
            for(Node* child:node->children){
                Node* result = findnode(child,val);
                if(result!=NULL){
                    return result;
                }
            }
            return NULL; 
        }
    public:
        Tree(){
            root = create();
        }
        void initialize(){
            root = create();
            cout<<"创建成功！"<<endl; 
        }
        void pretra(){
            pretra(root);
            cout<<endl;
        }
        void posttra(){
            posttra(root);
            cout<<endl; 
        }
        void leveltra(){
            leveltra(root);
            cout<<endl; 
        }
        int depth(){
            return depth(root);
        }
        void modify(char val,char newval){
           Node* node = findnode(root,val);
           if(node!=NULL){
            node->val = newval;
           }
        }
        void insertnode(char val,char newval){
            Node* node = findnode(root,val);
            if(node!=NULL){
                Node* newnode = new Node(newval);
                node->children.insertnode(node->children.begin(),newnode)
            } 
        }
};
int main(){
    Tree t;
    t.initialize();
    cout<<"先序遍历：";
    t.pretra();
    cout<<"后序遍历：";
    t.posttra(); 
    cout<<"层次遍历：";
    t.leveltra();
    cout<<"树的深度："<<t.depth()<<endl;
    t.modify('F','Z');
    cout<<"修改后先序遍历：";
    t.pretra();
    t.insertnode('D','G');
    cout<<"插入后先序遍历：";
    t.pretra();
    return 0;
}