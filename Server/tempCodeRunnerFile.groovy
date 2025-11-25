#include <iostream>
#include <vector>
#include <queue>
using namespace std;
// 树的结点类
class TreeNode {
public:
    char value;
    vector<TreeNode*> children;

    TreeNode(char val) : value(val) {}
};

// 树的类
class Tree {
public:
    TreeNode* root;

    Tree(TreeNode* r) : root(r) {}

    // 先序遍历
    void preorderTraversal(TreeNode* node) {
        if (node) {
            cout << node->value << " ";
            for (TreeNode* child : node->children) {
                preorderTraversal(child);
            }
        }
    }

    // 后序遍历
    void postorderTraversal(TreeNode* node) {
        if (node) {
            for (TreeNode* child : node->children) {
                postorderTraversal(child);
            }
            cout << node->value << " ";
        }
    }

    // 层次遍历
    void levelOrderTraversal() {
        if (!root) return;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            TreeNode* current = q.front();
            q.pop();
            cout << current->value << " ";
            for (TreeNode* child : current->children) {
                q.push(child);
            }
        }
    }

    // 计算树的深度
    int treeDepth(TreeNode* node) {
        if (!node) return 0;
        if (node->children.empty()) return 1;
        int maxDepth = 0;
        for (TreeNode* child : node->children) {
            int depth = treeDepth(child);
            if (depth > maxDepth) {
                maxDepth = depth;
            }
        }
        return maxDepth + 1;
    }

    // 查找并修改结点的值
    void findAndModify(TreeNode* node, char oldValue, char newValue) {
        if (node) {
            if (node->value == oldValue) {
                node->value = newValue;
            }
            for (TreeNode* child : node->children) {
                findAndModify(child, oldValue, newValue);
            }
        }
    }

    // 插入结点
    void insertNode(TreeNode* node, char parentValue, char newValue) {
        if (node) {
            if (node->value == parentValue) {
                TreeNode* newNode = new TreeNode(newValue);
                node->children.insert(node->children.begin(), newNode);
            }
            for (TreeNode* child : node->children) {
                insertNode(child, parentValue, newValue);
            }
        }
    }
};

// 递归创建树
TreeNode* createTree() {
    TreeNode* root = new TreeNode('A');
    TreeNode* nodeB = new TreeNode('B');
    TreeNode* nodeC = new TreeNode('C');
    TreeNode* nodeD = new TreeNode('D');
    TreeNode* nodeE = new TreeNode('E');
    TreeNode* nodeF = new TreeNode('F');

    root->children.push_back(nodeB);
    root->children.push_back(nodeC);
    nodeB->children.push_back(nodeD);
    nodeB->children.push_back(nodeE);
    nodeC->children.push_back(nodeF);

    return root;
}

int main() {
    // (1) 初始化一棵树
    TreeNode* root = createTree();
    Tree tree(root);

    cout << "先序遍历序列: ";
    tree.preorderTraversal(tree.root);
    cout << endl;

    cout << "后序遍历序列: ";
    tree.postorderTraversal(tree.root);
    cout << endl;

    cout << "层次遍历序列: ";
    tree.levelOrderTraversal();
    cout << endl;

    cout << "树的深度: " << tree.treeDepth(tree.root) << endl;

    tree.findAndModify(tree.root, 'F', '乙');
    cout << "修改后的层次遍历序列: ";
    tree.levelOrderTraversal();
    cout << endl;

    // (7) 插入值为 G 的结点，使其是值为 D 的结点的左孩子结点
    tree.insertNode(tree.root, 'D', 'G');
    cout << "插入后的层次遍历序列: ";
    tree.levelOrderTraversal();
    cout << endl;

    return 0;
}    